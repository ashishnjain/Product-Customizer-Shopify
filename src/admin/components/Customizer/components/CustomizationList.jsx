import React, { useState } from 'react';
import { Pencil, Trash2, Info } from 'lucide-react';

const CustomizationList = ({ onCreateNew, onViewTemplate }) => {
  const [templates] = useState(() => {
    const savedTemplates = localStorage.getItem('fieldTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Saved Templates</h5>
        <button 
          className="btn btn-primary"
          onClick={onCreateNew}
        >
          + Create Option Set
        </button>
      </div>

      {/* Templates Grid */}
      <div className="row g-4">
        {templates.map((template) => (
          <div key={template.id} className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                {/* Template Header */}
                <div className="d-flex align-items-start">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                    />
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{template.name}</h6>
                        <div className="text-muted small">
                          {template.fields?.length || 0} fields • Created {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-link p-0"
                          onClick={() => onViewTemplate(template)}
                        >
                          <Pencil size={16} className="text-primary" />
                        </button>
                        <button className="btn btn-link p-0">
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </div>

                    {/* Fields Section */}
                    <div className="mt-3">
                      <div className="d-flex align-items-center mb-2">
                        <h6 className="mb-0 me-2">Fields</h6>
                        <Info size={14} className="text-muted" />
                      </div>
                      <div className="fields-list">
                        {template.fields?.map((field, index) => (
                          <div key={index} className="field-item">
                            <span className="field-name">{field.config?.label}</span>
                            <span className="field-badge">{field.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomizationList; 