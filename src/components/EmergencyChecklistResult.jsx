import React, { useState, useMemo, useEffect } from 'react';

const EmergencyChecklistResult = ({ formData, onClose }) => {
  const [checkedItems, setCheckedItems] = useState(new Set());
  const [customItems, setCustomItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');

  useEffect(() => {
    // Save the checklist data to localStorage
    localStorage.setItem('savedChecklistData', JSON.stringify(formData));
  }, [formData]);

  const generateChecklist = (formData) => {
    const items = [];

    items.push({
      id: 'food-water',
      text: '3-day supply of non-perishable food and 3 gallons of water per person'
    });

    items.push({
      id: 'flashlight',
      text: 'Flashlight, extra batteries, and a hand-crank radio'
    });

    if (formData.infants > 0) {
      items.push({
        id: 'infant-needs',
        text: 'Diapers, formula, baby food, and other infant care supplies'
      });
    }

    if (formData.pets > 0) {
      items.push({
        id: 'pet-supplies',
        text: 'Food, water, and supplies for your pets'
      });
    }

    if (formData.hasAllergies === 'yes') {
      items.push({
        id: 'allergy-meds',
        text: 'Allergy medications and an EpiPen if prescribed'
      });
    }

    if (formData.takesmedications === 'yes') {
      items.push({
        id: 'medications',
        text: '1-week supply of prescription medications'
      });
    }

    if (formData.accessibilityNeeds.trim()) {
      items.push({
        id: 'accessibility-items',
        text: 'Mobility aids, assistive tech, or other accessibility-related tools'
      });
    }

    if (formData.worksOnsite === 'yes') {
      items.push({
        id: 'work-id',
        text: 'Work ID badge and contact info for your workplace'
      });
    }

    if (formData.preparationTime === '1hour') {
      items.push({
        id: 'go-bag',
        text: 'Go-bag with essentials near the exit for quick evacuation'
      });
    }

    items.push({
      id: 'docs',
      text: 'Waterproof copies of ID, insurance, medical records, and evacuation routes'
    });

    return items;
  };

  const defaultItems = useMemo(() => generateChecklist(formData), [formData]);

  const toggleItem = (itemId) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  const addCustomItem = () => {
    if (newItemText.trim()) {
      const newItem = {
        id: `custom-${Date.now()}`,
        text: newItemText.trim()
      };
      setCustomItems([...customItems, newItem]);
      setNewItemText('');
    }
  };

  const removeCustomItem = (itemId) => {
    setCustomItems(customItems.filter(item => item.id !== itemId));
    const newChecked = new Set(checkedItems);
    newChecked.delete(itemId);
    setCheckedItems(newChecked);
  };

  return (
    <div className="position-fixed top-0 start-0 end-0 bottom-0 bg-white d-flex flex-column" style={{zIndex: 1002}}>
      <div className="p-4 border-bottom d-flex justify-content-center align-items-center position-relative">
        <h1 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>Emergency Checklist</h1>
        <button
          className="btn-close position-absolute end-0"
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6L18 18" />
          </svg>
        </button>
      </div>

      <div className="flex-grow-1 overflow-auto p-4">
        <h2 className="fw-bold mb-4" style={{fontSize: '1.3rem'}}>Checklist</h2>
        {[...defaultItems, ...customItems].map(item => (
          <div key={item.id} className="d-flex align-items-start gap-3 mb-3">
            <input
              type="checkbox"
              className="form-check-input mt-1 custom-checkbox"
              style={{ transform: 'scale(1.1)', accentColor: '#84B5CE' }}
              checked={checkedItems.has(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <label className="flex-grow-1" style={{lineHeight: '1.4', fontSize: '0.95rem', color: '#374151'}}>
              {item.text}
            </label>
            {item.id.startsWith('custom-') && (
              <button 
                className="btn btn-sm text-danger border-0 bg-transparent p-1"
                onClick={() => removeCustomItem(item.id)}
                style={{fontSize: '1rem', lineHeight: '1'}}
                title="Remove item"
              >
                ×
              </button>
            )}
          </div>
        ))}

        <div className="d-flex justify-content-center mt-4">
          <input
            type="text"
            className="form-control custom-focus"
            placeholder="Add custom checklist item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') addCustomItem();
            }}
            style={{
              maxWidth: '300px',
              marginRight: '8px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '0.95rem'
            }}
          />
          <button
            className="btn"
            onClick={addCustomItem}
            style={{
              backgroundColor: '#84B5CE',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div className="p-4 border-top bg-white">
        <div className="d-flex justify-content-center">
          <button
            className="btn px-5 py-3 fw-medium"
            onClick={onClose}
            style={{
              backgroundColor: '#003049',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem'
            }}
          >
            Save list
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyChecklistResult;
