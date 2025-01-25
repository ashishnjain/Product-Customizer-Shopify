import React from 'react';
import { FileText, Info, Pencil, Trash2 } from 'lucide-react';

const TemplateListScreen = ({ onBack, onEditTemplate }) => {
  const [templates, setTemplates] = React.useState(() => {
    const savedTemplates = localStorage.getItem('fieldTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });

  const handleDeleteTemplate = (templateId) => {
    const updatedTemplates = templates.filter(template => template.id !== templateId);
    localStorage.setItem('fieldTemplates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Saved Option Sets</h5>
        <button 
          className="btn btn-primary"
          onClick={() => onBack()}
        >
          + Create Option
        </button>
      </div>

      {/* Templates Grid */}
      <div className="row g-4">
        {templates.map((template) => (
          <div key={template.id} className="col-lg-4">
            <div className="card h-100">
              <div className="card-body">
                {/* Template Header */}
                <div className="d-flex align-items-start mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                    />
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <h6 className="mb-1">{template.name}</h6>
                    <div className="text-muted small">
                      <FileText size={14} className="me-1" />
                      {template.fields?.length || 0} fields • Created {new Date(template.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm p-1"
                      onClick={() => onEditTemplate(template)}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm p-1"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Fields Section */}
                <div>
                  <div className="d-flex align-items-center mb-2">
                    <h6 className="mb-0 me-2">Fields</h6>
                    <Info size={14} className="text-muted" />
                  </div>
                  <div className="field-list">
                    {template.fields.map((field, index) => (
                      <div key={index} className="d-flex align-items-center mb-2 bg-light rounded p-2">
                        <span className="me-2">{field.config.label}</span>
                        <span className="badge bg-primary rounded-pill">
                          {field.type}
                        </span>
                      </div>
                    ))}
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

export default TemplateListScreen;