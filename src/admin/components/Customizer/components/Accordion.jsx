import React, { useState } from "react";
import ElementPreview from "./ElementPreview";
import "./Accordion.css";

const Accordion = ({ elements, onUpdate }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleEdit = (elementId) => {
    setExpandedSection(expandedSection === elementId ? null : elementId);
  };

  const renderPreviewHeader = (element) => {
    const selectedValue = element.config?.defaultValue;
    const selectedOption = element.config?.options?.find(
      (opt) => opt.value === selectedValue
    );

    return (
      <div className="preview-header d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3 flex-grow-1">
          <span className="preview-label">{element.config?.label}</span>
          {element.type === "radio" && (
            <span className="selected-value text-primary">
              {selectedOption?.label || "Select an option"}
            </span>
          )}
        </div>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => handleEdit(element.id)}
        >
          Edit
        </button>
      </div>
    );
  };

  return (
    <div className="customizer-accordion">
      {elements.map((element) => (
        <div key={element.id} className="accordion-item">
          {renderPreviewHeader(element)}

          {expandedSection === element.id && (
            <div className="accordion-content">
              <ElementPreview
                element={element}
                onUpdate={(updatedElement) => {
                  onUpdate(updatedElement);
                  setExpandedSection(null); // Close accordion after selection
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Accordion;
