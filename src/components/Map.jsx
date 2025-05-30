import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ setSelectedCounty, setLoadingCounty }) => {
  const [mapLoading, setMapLoading] = useState(true);

  useEffect(() => {
    const map = L.map('map').setView([47.5, -120.5], 7);

    const isLocationAllowed = localStorage.getItem("locationEnabled") !== "false";
    if (isLocationAllowed) {
      map.locate({ setView: false, maxZoom: 12 });
    }

    map.on('locationfound', (e) => {
      const { latlng } = e;
      map._userLatLng = latlng;

      if (!map._userLocationLayers) map._userLocationLayers = [];
      map._userLocationLayers.forEach(layer => map.removeLayer(layer));
      map._userLocationLayers = [];

      const ring1 = L.circleMarker(latlng, {
        radius: 28,
        fillColor: 'rgba(0, 0, 0, 0.05)',
        color: null,
        fillOpacity: 1,
        weight: 0,
        pane: 'markerPane'
      }).addTo(map);

      const ring2 = L.circleMarker(latlng, {
        radius: 21,
        fillColor: 'rgba(0, 0, 0, 0.09)',
        color: null,
        fillOpacity: 1,
        weight: 0,
        pane: 'markerPane'
      }).addTo(map);

      const ring3 = L.circleMarker(latlng, {
        radius: 14,
        fillColor: 'rgba(0, 0, 0, 0.14)',
        color: null,
        fillOpacity: 1,
        weight: 0,
        pane: 'markerPane'
      }).addTo(map);

      const dot = L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#1E90FF',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
        pane: 'markerPane'
      }).addTo(map);

      map._userLocationLayers.push(ring1, ring2, ring3, dot);
    });

    let searchMarker;

    const handleFlyTo = (e) => {
      const { lat, lng } = e.detail;

      map.flyTo([lat, lng], 10);

      if (searchMarker) {
        map.removeLayer(searchMarker);
      }

      searchMarker = L.circleMarker([lat, lng], {
        radius: 7,
        fillColor: '#FF5722',
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(map);
    };

    window.addEventListener("flyToLocation", handleFlyTo);

    const handleFlyToUser = () => {
      if (map._userLatLng) {
        map.flyTo(map._userLatLng, 12, { animate: true });
      } else {
        console.warn("No user location available yet");
      }
    };

    window.addEventListener("flyToUser", handleFlyToUser);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counties`)
      .then((res) => res.json())
      .then((geojson) => {
        L.geoJSON(geojson, {
          style: (feature) => ({
            fillColor: getRiskColor(feature.properties.riskLevel),
            fillOpacity: 0.6,
            color: '#000',
            weight: 1,
          }),
          onEachFeature: (feature, layer) => {
            layer.on('click', async () => {
              const fips = feature.properties.fips;
              setLoadingCounty(true);
              try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/counties/${fips}`);
                const data = await res.json();
                setSelectedCounty(data);
              } catch (err) {
                console.error('❌ Failed to fetch county:', err);
              } finally {
                setTimeout(() => setLoadingCounty(false), 300);
              }
            });
          },
        }).addTo(map);

        setTimeout(() => {
          setMapLoading(false);
        }, 2000);
      })
      .catch(err => {
        console.error("❌ Error loading geojson:", err);
        setMapLoading(false);
      });

    return () => {
      map.remove();
      window.removeEventListener("flyToLocation", handleFlyTo);
      window.removeEventListener("flyToUser", handleFlyToUser);
    };
  }, []);

  return (
    <>
      {mapLoading && (
        <div className="map-loading-overlay">
          <div className="spinner-border text-secondary" role="status" />
          <p className="mt-2 text-muted">Loading risk levels...</p>
        </div>
      )}
      <div id="map" style={{ height: '100vh', width: '100%' }}></div>
    </>
  );
};

function getRiskColor(risk) {
  switch (risk) {
    case 'minimal': return '#A8E6CF';
    case 'low': return '#DCEDC1';
    case 'moderate': return '#FFD3B6';
    case 'high': return '#FFAAA5';
    case 'extreme': return '#FF8B94';
    default: return '#D3D3D3';
  }
}

export default Map;
