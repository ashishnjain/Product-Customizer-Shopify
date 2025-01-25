import React, { useState } from "react";
import { Info } from "lucide-react";

const TemplateModal = ({ onClose, onSave, selectedElements, elements }) => {
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    const selectedFields = elements.filter((_, index) => 
      selectedElements.includes(index)
    );

    onSave({
      id: Date.now(),
      name: templateName,
      description: templateDescription,
      fields: selectedFields,
      createdAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="modal-backdrop bg-transparent">
      <div className="element-selection-modal">
        <div className="modal-content bg-light border shadow p-2 rounded">
          <div className="modal-header border-bottom d-flex justify-content-between p-2">
            <h5 className="modal-title">Save as Template</h5>
            <button
              type="button"
              className="btn-close fs-5"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body p-md-4 p-1">
            {/* Template Name */}
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <label className="form-label mb-0">Template Name</label>
                <Info size={16} className="text-muted" />
              </div>
              <input
                type="text"
                className="form-control"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>

            {/* Template Description */}
            <div className="mb-4">
              <label className="form-label">Description (optional)</label>
              <textarea
                className="form-control"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Enter template description"
                rows={2}
              />
            </div>

            {/* Selected Fields Preview */}
            <div className="mb-4">
              <h6 className="mb-2">Selected Fields ({selectedElements.length})</h6>
              <div className="border rounded p-3 bg-white">
                {elements
                  .filter((_, index) => selectedElements.includes(index))
                  .map((element, index) => (
                    <div key={index} className="mb-2 d-flex align-items-center gap-2">
                      <span className="fw-medium">{element.config.label}</span>
                      <span className="text-muted small">({element.type})</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2">
              <button 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!templateName.trim()}
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
