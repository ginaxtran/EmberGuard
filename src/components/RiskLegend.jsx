import React from 'react';
import { motion } from 'framer-motion';
import './RiskLegend.css';

const RiskLegend = ({ onClose }) => {
    return (
      <div className="legend-overlay">
        <motion.div 
          className="legend-sheet"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="legend-header d-flex justify-content-between align-items-center">
            <h3 className="m-0">Risk Level</h3>
            <button className="sheet-close" onClick={onClose}>×</button>
          </div>
  
          <div className="legend-content">
            <div className="legend-entry minimal">
              <div className="dot" style={{ background: '#A8E6CF' }} />
              <div>
                <strong>Minimal Risk</strong> — Score &lt; 15
                <ul>
                  <li>Recent rainfall</li>
                  <li>High humidity</li>
                  <li>Cool temps & calm winds</li>
                </ul>
                Fires are very unlikely. If ignition occurs, fire spreads slowly and is easy to contain.
              </div>
            </div>
  
            <div className="legend-entry low">
              <div className="dot" style={{ background: '#DCEDC1' }} />
              <div>
                <strong>Low Risk</strong> — Score 15–29
                <ul>
                  <li>Some fuel drying</li>
                  <li>Moderate humidity</li>
                  <li>Light wind, mild temps</li>
                </ul>
                Fires can start under the right spark, but are typically controllable. Growth is limited.
              </div>
            </div>
  
            <div className="legend-entry moderate">
              <div className="dot" style={{ background: '#FFD3B6' }} />
              <div>
                <strong>Moderate Risk</strong> — Score 30–49
                <ul>
                  <li>Humidity drops below 50%</li>
                  <li>Days without rain</li>
                  <li>Increasing wind and temps</li>
                </ul>
                Fires start more easily and can spread quicker under wind. Multiple starts can be harder to contain.
              </div>
            </div>
  
            <div className="legend-entry high">
              <div className="dot" style={{ background: '#FFAAA5' }} />
              <div>
                <strong>High Risk</strong> — Score 50–69
                <ul>
                  <li>Low humidity</li>
                  <li>Wind &gt;15mph</li>
                  <li>Critically dry grass & brush</li>
                </ul>
                Fires can ignite easily and spread aggressively. Spotting likely. Suppression is difficult.
              </div>
            </div>
  
            <div className="legend-entry extreme">
              <div className="dot" style={{ background: '#FF8B94' }} />
              <div>
                <strong>Extreme Risk</strong> — Score 70+
                <ul>
                  <li>Ongoing drought</li>
                  <li>Very low humidity (&lt;20%)</li>
                  <li>Strong winds (20+ mph)</li>
                  <li>Fuel is highly flammable</li>
                </ul>
                Sparks can lead to uncontrollable wildfire. Spot fires may jump miles ahead. Red flag warnings likely.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };
  
  export default RiskLegend;
  