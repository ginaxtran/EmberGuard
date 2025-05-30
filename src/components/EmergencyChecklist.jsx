import React, { useState, useEffect } from 'react';
import EmergencyChecklistResult from './EmergencyChecklistResult';

const EmergencyChecklist = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
    accessibilityNeeds: '',
    hasAllergies: '',
    takesmedications: '',
    worksOnsite: '',
    preparationTime: '',
    county: '',
    buildingType: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('savedChecklistData');
    if (saved) {
      setFormData(JSON.parse(saved));
      setCurrentStep(4);
    }
  }, []);

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const incrementCounter = (field) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] + 1 }));
  };

  const decrementCounter = (field) => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, prev[field] - 1) }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    console.log('Questionnaire completed:', formData);
    setCurrentStep(4);
  };

  if (currentStep === 4) {
    return <EmergencyChecklistResult formData={formData} onClose={onClose} />;
  }

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{ zIndex: 1002 }}>
      <div className="pt-5 px-4 pb-3 border-bottom d-flex justify-content-between align-items-center">
        <h2 className="mb-0 fw-bold text-brand">Emergency Checklist Questionnaire</h2>
        <button className="btn btn-outline-secondary" onClick={onClose}>Close</button>
      </div>

      <div className="flex-grow-1 overflow-auto p-4">
        {currentStep === 0 && (
          <div className="text-center">
            <p className="text-muted mb-4" style={{ fontSize: '1.1rem' }}>
              This short form helps us understand your situation so we can create a personalized checklist.
            </p>
            <button className="btn btn-gradient-primary px-4 py-3 fw-medium" onClick={() => setCurrentStep(1)}>
              Start
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h3 className="fw-bold mb-5 text-center text-brand" style={{ fontSize: '1.5rem' }}>
              How many people are there in your household?
            </h3>

            {['adults', 'children', 'infants', 'pets'].map(type => (
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom" key={type}>
                <div>
                  <h4 className="fw-bold mb-1 text-capitalize">{type}</h4>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <button className="btn btn-outline-secondary rounded-circle" onClick={() => decrementCounter(type)} style={{ width: '40px', height: '40px' }}>-</button>
                  <span className="fw-bold" style={{ fontSize: '1.5rem', minWidth: '30px', textAlign: 'center' }}>{formData[type]}</span>
                  <button className="btn btn-outline-secondary rounded-circle" onClick={() => incrementCounter(type)} style={{ width: '40px', height: '40px' }}>+</button>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-5">
              <button className="btn btn-custom-inactive" onClick={prevStep}>Back</button>
              <button className="btn btn-gradient-primary px-4 py-2 fw-medium" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <h3 className="fw-bold mb-5 text-brand" style={{ fontSize: '1.5rem' }}>
              Health and work information
            </h3>

            <div className="d-flex flex-column align-items-center gap-5">
              {[
                { field: 'hasAllergies', label: 'Do you have any allergies?' },
                { field: 'takesmedications', label: 'Do you regularly take medications?' },
                { field: 'worksOnsite', label: 'Do you work on-site?' }
              ].map(({ field, label }) => (
                <div key={field} className="w-100" style={{ maxWidth: '440px' }}>
                  <h4 className="mb-3 fw-bold text-center" style={{ fontSize: '1.1rem' }}>{label}</h4>
                  <div className="d-flex justify-content-center gap-4">
                    {['yes', 'no'].map(val => (
                      <div key={val} className="form-check d-flex align-items-center">
                        <input
                          className="form-check-input custom-checkbox"
                          type="radio"
                          name={field}
                          checked={formData[field] === val}
                          onChange={() => updateFormData(field, val)}
                        />
                        <label className="form-check-label text-capitalize ms-2" style={{ fontSize: '1.1rem' }}>{val}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="w-100" style={{ maxWidth: '440px' }}>
                <h4 className="mb-3 fw-bold text-center" style={{ fontSize: '1.1rem' }}>
                  How early would you prefer to prepare?
                </h4>
                <div className="d-flex flex-column gap-3 align-items-center">
                  {['3day', '1day', '1hour'].map(val => (
                    <div key={val} className="form-check d-flex align-items-center">
                      <input
                        className="form-check-input custom-checkbox"
                        type="radio"
                        name="preparationTime"
                        checked={formData.preparationTime === val}
                        onChange={() => updateFormData('preparationTime', val)}
                      />
                      <label className="form-check-label ms-2" style={{ fontSize: '1.1rem' }}>
                        {val === '3day' ? '3 days before' : val === '1day' ? '1 day before' : '1 hour before'}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between mt-5">
              <button className="btn btn-custom-inactive" onClick={prevStep}>Back</button>
              <button className="btn btn-gradient-primary px-4 py-2 fw-medium" onClick={nextStep}>Next</button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 className="fw-bold mb-5 text-center text-brand" style={{ fontSize: '1.5rem' }}>Location & Housing</h3>

            <div className="mb-5">
              <label className="form-label fw-medium mb-2">Which county do you live in?</label>
              <input
                type="text"
                className="form-control form-control-lg custom-focus"
                value={formData.county}
                onChange={(e) => updateFormData('county', e.target.value)}
                placeholder="Enter your county"
                style={{ borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '1rem' }}
              />
            </div>

            <div className="mb-5">
              <label className="form-label fw-medium mb-3">What type of building do you live in?</label>
              <div className="d-flex flex-column gap-3">
                {[
                  { type: 'house', icon: '/thfhouse.png' },
                  { type: 'townhouse', icon: '/thftown.png' },
                  { type: 'apartment', icon: '/thfapt.png' },
                  { type: 'other' }
                ].map(({ type, icon }) => (
                  <div key={type} className="form-check d-flex align-items-center gap-2">
                    <input
                      className="form-check-input custom-checkbox"
                      type="radio"
                      name="buildingType"
                      checked={formData.buildingType === type}
                      onChange={() => updateFormData('buildingType', type)}
                    />
                    {icon && (
                      <img src={icon} alt={type} style={{ width: '28px', height: '28px' }} />
                    )}
                    <label className="form-check-label text-capitalize ms-1" style={{ fontSize: '1.1rem' }}>{type}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label fw-medium mb-2">Any accessibility needs?</label>
              <textarea
                className="form-control form-control-lg custom-focus"
                rows="4"
                value={formData.accessibilityNeeds}
                onChange={(e) => updateFormData('accessibilityNeeds', e.target.value)}
                placeholder="Enter your accessibility needs..."
                style={{ borderRadius: '12px', border: '2px solid #e5e7eb', fontSize: '1rem' }}
              />
            </div>

            <div className="d-flex justify-content-between mt-5">
              <button className="btn btn-custom-inactive" onClick={prevStep}>Back</button>
              <button className="btn btn-gradient-primary px-4 py-2 fw-medium" onClick={handleFinish}>Finish</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyChecklist;
