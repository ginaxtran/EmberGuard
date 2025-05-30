import React, { useState, useEffect } from 'react';
import HousingForm from './HousingForm';
import EmergencyChecklist from './EmergencyChecklist';

const PreparePage = () => {
  const [showHousingForm, setShowHousingForm] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [checklistKey, setChecklistKey] = useState(0);
  const [checklistDataExists, setChecklistDataExists] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('savedChecklistData');
    setChecklistDataExists(!!saved);
  }, [showChecklistForm]);

  const handleResubmit = (itemType) => {
    if (itemType === 'emergency checklist') {
      localStorage.removeItem('savedChecklistData');
      localStorage.removeItem('checkedItems'); // ⬅️ NEW
      localStorage.removeItem('customItems');  // ⬅️ NEW
      setChecklistKey(prev => prev + 1);
      setShowChecklistForm(true);
    } else if (itemType === 'temporary housing form') {
      setShowHousingForm(true);
    }
  };

  const handleView = (itemType) => {
    if (itemType === 'emergency checklist') {
      setShowChecklistForm(true);
    } else if (itemType === 'temporary housing form') {
      setShowHousingForm(true);
    }
  };

  const handleCloseHousingForm = () => {
    setShowHousingForm(false);
  };

  const handleCloseChecklistForm = () => {
    setShowChecklistForm(false);
  };
  return (
    <>
      <div className="h-100 d-flex flex-column bg-white overflow-hidden">
        <div className="pt-5 px-4 pb-3">
          <h1 className="text-brand fw-bold mb-0" style={{fontSize: '2.5rem'}}>Prepare</h1>
        </div>

        <div className="flex-grow-1 overflow-auto px-4 pb-5">
          <div className="card border-0 shadow-sm mb-4">
            <div className="position-relative">
              <img 
                src="/preparechecklist.png" 
                alt="Emergency supplies" 
                className="card-img-top"
                style={{height: '180px', objectFit: 'cover'}}
              />
            </div>
            <div className="card-body p-4">
              <h3 className="card-title h4 fw-bold mb-3">Emergency Checklist</h3>
              <p className="card-text text-muted mb-4" style={{lineHeight: '1.5'}}>
                A checklist builder to help you have all your resources in one place in case of an emergency
              </p>
              <div className="d-flex justify-content-end align-items-center gap-4">
                {checklistDataExists && (
                  <button 
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleResubmit('emergency checklist')}
                    style={{color: '#84B5CE', fontSize: '1.1rem'}}>
                    Redo
                  </button>
                )}
                <button 
                  className="btn text-white px-4 py-2 fw-medium"
                  onClick={() => {
                    handleView('emergency checklist')
                  }}
                  style={{
                    backgroundColor: '#1e3a5f',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}>
                  {checklistDataExists ? 'View' : 'Start'}
                </button>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm mb-4">
            <div className="position-relative">
              <img 
                src="/preparehouse.png" 
                alt="Temporary housing" 
                className="card-img-top"
                style={{height: '180px', objectFit: 'cover'}}
              />
            </div>
            <div className="card-body p-4">
              <h3 className="card-title h4 fw-bold mb-3">Temporary Housing Form</h3>
              <p className="card-text text-muted mb-4" style={{lineHeight: '1.5'}}>
                A short form to apply for temporary housing
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <button 
                  className="btn btn-link p-0 text-decoration-none"
                  onClick={() => handleResubmit('temporary housing form')}
                  style={{color: '#84B5CE', fontSize: '1.1rem'}}>
                  Resubmit
                </button>
                <button 
                  className="btn text-white px-4 py-2 fw-medium"
                  onClick={() => handleView('temporary housing form')}
                  style={{
                    backgroundColor: '#1e3a5f',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}>
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHousingForm && <HousingForm onClose={handleCloseHousingForm} />}
      {showChecklistForm && (
        <EmergencyChecklist onClose={handleCloseChecklistForm} />
      )}
    </>
  );
};

export default PreparePage;
