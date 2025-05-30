let lastLayer = null;
let userLocationLayers = [];

const map = L.map('map', { 
  zoomControl: false,
  attributionControl: false,
  zoomAnimation: true,
  zoomAnimationThreshold: 4,
  fadeAnimation: true,
  inertia: true,
  inertiaDeceleration: 3000,
  inertiaMaxSpeed: Infinity,
  worldCopyJump: true, 
}).setView([47.6, -122.3], 7);

map.on('locationfound', (e) => {
  const radius = e.accuracy;

  // clear old layers
  userLocationLayers.forEach(layer => map.removeLayer(layer));
  userLocationLayers = [];

  // outer soft shadow
  const outer = L.circleMarker(e.latlng, {
    radius: 28,
    fillColor: 'rgba(0, 0, 0, 0.05)',
    color: null,
    fillOpacity: 1,
    weight: 0,
    pane: 'markerPane'
  }).addTo(map);
  userLocationLayers.push(outer);

  const mid = L.circleMarker(e.latlng, {
    radius: 21,
    fillColor: 'rgba(0, 0, 0, 0.09)',
    color: null,
    fillOpacity: 1,
    weight: 0,
    pane: 'markerPane'
  }).addTo(map);
  userLocationLayers.push(mid);

  const inner = L.circleMarker(e.latlng, {
    radius: 14,
    fillColor: 'rgba(0, 0, 0, 0.14)',
    color: null,
    fillOpacity: 1,
    weight: 0,
    pane: 'markerPane'
  }).addTo(map);
  userLocationLayers.push(inner);

  const area = L.circle(e.latlng, {
    radius: radius,
    color: null,
    fillColor: '#3b82f6',
    fillOpacity: 0.2,
    weight: 0,
    pane: 'markerPane'
  }).addTo(map);
  userLocationLayers.push(area);

  const dot = L.circleMarker(e.latlng, {
    radius: 10,
    color: '#ffffff',
    fillColor: '#3b82f6',
    fillOpacity: 1,
    weight: 2,
    pane: 'markerPane'
  }).addTo(map);
  userLocationLayers.push(dot);
});

map.on('locationerror', () => {
  alert("Location access denied.");
});

map.locate({ setView: true, maxZoom: 12 });
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.control.attribution({ position: 'topright', prefix: false }).addTo(map);

map.on('click', () => closePopup());

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
).addTo(map);

fetch('http://localhost:3000/api/counties')
  .then(res => res.json())
  .then(counties => renderCounties(counties))
  .catch(err => console.error('fetch error:', err));

const colors = {
  minimal: '#10b981',
  low: '#22c55e',
  moderate: '#facc15',
  high: '#f97316',
  extreme: '#ef4444'
};

function styleByFeature(feature) {
  let raw = feature.properties.riskLevel || '';
  let level = raw.toLowerCase().trim();

  const fallbackColor = '#ccc';
  const fill = colors[level] || fallbackColor;

  if (!colors[level]) {
    console.warn(`Unknown risk level: "${raw}"`);
  }

  return {
    weight: 1,
    color: '#555',
    fillColor: fill,
    fillOpacity: 0.6
  };
}

function onEachFeature(feature, layer) {
  layer.on('click', (e) => {
    L.DomEvent.stopPropagation(e); // 🔒 this prevents the map click from firing

    layer.setStyle({ fillOpacity: 0.9 });
    setTimeout(() => layer.setStyle(styleByFeature(feature)), 100);

    // slide in popup immediately
    sheet.classList.remove('hidden');
    requestAnimationFrame(() => {
      sheet.classList.add('open');
      document.querySelector('.leaflet-control-zoom').style.bottom = '90vh';
    });

    sheet.innerHTML = `
      <div id="sheet-handle"></div>
      <div class="loading-wrapper">
        <div class="loader"></div>
        <p>Loading wildfire data...</p>
      </div>
    `;

    fetch(`http://localhost:3000/api/counties/${feature.properties.fips}`)
      .then(r => r.json())
      .then(data => {
        const popupHTML = buildPopup(data);
        sheet.innerHTML = `<div id="sheet-handle"></div>${popupHTML}`;
      });
  });
}


function renderCounties(counties) {
  console.log('rendering', counties.length, 'counties');
  console.log('example:', counties[0]);
  counties.forEach(county => {
    const feature = {
      type: 'Feature',
      geometry: county.geometry,
      properties: {
        countyName: county.countyName,
        riskLevel: county.riskLevel,
        fips: county.fips
      }
    };

    L.geoJSON(feature, {
      style: styleByFeature,
      onEachFeature: onEachFeature
    }).addTo(map);
  });
}

const sheet = document.getElementById('sheet');
const mapUI = document.getElementById('map-ui');

function buildPopup(data) {
  return `
  <div class="popup-container">
    <div class="popup-header">
      <button class="close-btn" onclick="closePopup()">✕</button>
      <span class="risk-dot ${data.riskLevel?.toLowerCase()}"></span>
      <span class="risk-text">${(data.riskLevel || 'unknown').toUpperCase()} RISK</span>
    </div>
    
    <h2 class="county-name">${data.countyName}</h2>

    <div class="wildfire-status">
      🔥 Risk Score: <strong>${data.riskScore ?? 'N/A'}</strong>
    </div>

    <div class="county-map">
      <img src="img/wa-${data.fips}.svg" alt="County Map" onerror="this.style.display='none'" />
    </div>

    <div class="data-cards">
      <div class="data-card">
        <p class="label">🌫 Air Quality</p>
        <p class="value">~${data.aqi?.index || 'N/A'}</p>
        <p class="subtext">${data.aqi?.label || ''}</p>
      </div>
      <div class="data-card">
        <p class="label">💧 Humidity</p>
        <p class="value">~${parseFloat(data.weather?.humidity || 0).toFixed(1)}%</p>
        <p class="subtext">Dew Point: ~${parseFloat(data.weather?.dewPoint || 0).toFixed(1)}°</p>
      </div>
      <div class="data-card">
        <p class="label">💨 Wind</p>
        <p class="value">~${parseFloat(data.weather?.windSpeed || 0).toFixed(1)} mph</p>
        <p class="subtext">Gusts: ~${parseFloat(data.weather?.windGust || 0).toFixed(1)} mph</p>
      </div>
    </div>
  </div>`;
}

function closePopup() {
  sheet.classList.remove('open');
  setTimeout(() => {
  sheet.classList.add('hidden');
  sheet.innerHTML = '<div id="sheet-handle"></div>';
  document.querySelector('.leaflet-control-zoom').style.bottom = '1rem';
  }, 300);
}

document.getElementById('sheet-handle')
  .addEventListener('click', () => sheet.classList.toggle('open'));

  const tabMap = document.getElementById('tab-map');
  const tabAlerts = document.getElementById('tab-alerts');
  const tabPrep = document.getElementById('tab-prep');
  const tabProfile = document.getElementById('tab-profile');
  
  const mapDiv = document.getElementById('map-page');
  const alertsPg = document.getElementById('alerts-page');
  const prepPg = document.getElementById('prep-page');
  const profilePg = document.getElementById('profile-page');
  
  function setActiveTab(activeTab, activePage) {
    [tabMap, tabAlerts, tabPrep, tabProfile].forEach(btn => btn.classList.remove('active'));
    activeTab.classList.add('active');
  
    [mapDiv, alertsPg, prepPg, profilePg].forEach(pg => {
      if (pg) pg.classList.add('hidden');
    });
    activePage.classList.remove('hidden');
  
    if (activePage === mapDiv) {
      mapUI.style.display = 'block';
      map.invalidateSize();
    } else {
      mapUI.style.display = 'none';
    }
  }
  
  tabMap.addEventListener('click', () => {
    setActiveTab(tabMap, mapDiv);
    map.invalidateSize();
  });
  tabAlerts.addEventListener('click', () => setActiveTab(tabAlerts, alertsPg));

  tabPrep.addEventListener('click', async () => {
    if (!prepPg.innerHTML.trim()) {
      const res = await fetch('prep.html');
      const html = await res.text();
      prepPg.innerHTML = html;
    }
    setActiveTab(tabPrep, prepPg);
  });
  
  tabProfile.addEventListener('click', () => setActiveTab(tabProfile, profilePg));

function showMap() {
  tabMap.classList.add('active');
  mapDiv.style.display = 'block';
  map.invalidateSize();
}

const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
let searchMarker = null;

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = searchInput.value.trim();
    if (q) geocodeAndFly(q);
  }
});

async function geocodeAndFly(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
  const res = await fetch(url, { headers: { 'User-Agent': 'FireSourceApp/1.0' } });
  const [result] = await res.json();
  if (!result) return alert('no results found');

  const lat = parseFloat(result.lat);
  const lon = parseFloat(result.lon);

  if (searchMarker) {
    map.removeLayer(searchMarker);
  }

  map.flyTo([lat, lon], 12);
  searchMarker = L.marker([lat, lon]).addTo(map);
}

document.getElementById('locate-btn').addEventListener('click', () => {
  map.locate({ setView: true, maxZoom: 12 });
});

document.getElementById('checklist-card').addEventListener('click', () => {
  alert('📋 Emergency Checklist coming soon...');
});

document.getElementById('housing-card').addEventListener('click', () => {
  alert('📄 Temporary Housing Form coming soon...');
});
