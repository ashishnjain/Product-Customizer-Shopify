import React, { useState } from 'react';

const CustomizationPreview = ({ elements }) => {
  const [selectedStyles, setSelectedStyles] = useState({});
  const [activeEdit, setActiveEdit] = useState(null);

  const handleStyleSelect = (elementLabel, styleName) => {
    setSelectedStyles(prev => ({
      ...prev,
      [elementLabel]: styleName
    }));
    setActiveEdit(null);
  };

  return (
    <div className="customization-preview">
      <h6 className="customization-title mb-4">CUSTOMISE</h6>
      {elements.map((element, index) => (
        <div key={index} className="customization-item">
          <div className="option-header">
            <span className="option-label">{element.config.label}</span>
            <div className="option-controls">
              <span className="selected-value">
                {selectedStyles[element.config.label] || 
                  (element.config.styles?.find(s => s.isDefault)?.name || 
                   element.config.styles?.[0]?.name)}
              </span>
              {element.config.showEdit && (
                <button 
                  className="edit-btn-new"
                  onClick={() => setActiveEdit(activeEdit === element.config.label ? null : element.config.label)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
          {activeEdit === element.config.label && (
            <div className="style-options-container">
              <div className="style-options-grid">
                {element.config.styles.map((style, idx) => (
                  <div key={idx} className="style-card">
                    <div 
                      className={`style-card-inner ${style.name === selectedStyles[element.config.label] ? 'selected' : ''}`}
                      onClick={() => handleStyleSelect(element.config.label, style.name)}
                    >
                      <div className="style-image">
                        {style.image ? (
                          <img 
                            src={style.image} 
                            alt={style.name}
                          />
                        ) : (
                          <div className={`pocket-sketch ${style.name.toLowerCase().replace(/\s+/g, '-')}`}></div>
                        )}
                      </div>
                      <div className="style-info">
                        <div className="style-name">{style.name}</div>
                        <div className="style-desc">{style.description}</div>
                        <div className="style-emoji">😊</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomizationPreview; 