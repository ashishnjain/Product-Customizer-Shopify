import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const CreateTemplate = ({ onBack, onSave }) => {
  const [templateName, setTemplateName] = useState('');
  const [selectedOptionSets, setSelectedOptionSets] = useState([]);
  
  const [optionSets] = useState(() => {
    const savedOptionSets = localStorage.getItem('optionSets');
    return savedOptionSets ? JSON.parse(savedOptionSets) : [];
  });

  const handleSave = () => {
    if (!templateName.trim()) {
      alert('Please enter template name');
      return;
    }

    if (selectedOptionSets.length === 0) {
      alert('Please select at least one option set');
      return;
    }

    const newTemplate = {
      id: Date.now(),
      name: templateName,
      optionSets: selectedOptionSets,
      createdAt: new Date().toISOString()
    };

    // Get existing templates
    const existingTemplates = localStorage.getItem('templates');
    const templates = existingTemplates ? JSON.parse(existingTemplates) : [];

    // Save new template
    localStorage.setItem('templates', JSON.stringify([...templates, newTemplate]));
    onSave(newTemplate);
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-link p-0 text-dark"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </button>
          <h5 className="mb-0">Create Template</h5>
        </div>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!templateName || selectedOptionSets.length === 0}
        >
          Save Template
        </button>
      </div>

      <div className="row">
        <div className="col-md-8">
          {/* Template Name */}
          <div className="mb-4">
            <label className="form-label">Template Name</label>
            <input
              type="text"
              className="form-control"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          {/* Option Sets Selection */}
          <div>
            <h6 className="mb-3">Select Option Sets</h6>
            <div className="row g-3">
              {optionSets.map((optionSet) => (
                <div key={optionSet.id} className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`optionSet-${optionSet.id}`}
                          checked={selectedOptionSets.some(set => set.id === optionSet.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOptionSets([...selectedOptionSets, optionSet]);
                            } else {
                              setSelectedOptionSets(selectedOptionSets.filter(set => set.id !== optionSet.id));
                            }
                          }}
                        />
                        <label className="form-check-label" htmlFor={`optionSet-${optionSet.id}`}>
                          <h6 className="mb-1">{optionSet.name}</h6>
                          <div className="text-muted small">
                            {optionSet.fields?.length || 0} fields
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-3">Template Preview</h6>
              {selectedOptionSets.map((optionSet, index) => (
                <div key={index} className="mb-3">
                  <h6 className="small fw-bold mb-2">{optionSet.name}</h6>
                  <div className="fields-list">
                    {optionSet.fields?.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="field-item small">
                        {field.config?.label}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate; 