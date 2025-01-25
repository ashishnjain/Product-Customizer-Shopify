import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import ElementPreview from "./ElementPreview";
import TextSettings from "./ElementEditForm/TextSettings";
import TextAreaSettings from "./ElementEditForm/TextAreaSettings";
import NumberSettings from "./ElementEditForm/NumberSettings";
import EmailSettings from "./ElementEditForm/EmailSettings";
import PhoneSettings from "./ElementEditForm/PhoneSettings";

const NewOptionSet = ({ onBack, editingOption, onSave }) => {
  const [elements, setElements] = useState(editingOption?.elements || []);
  const [editingElement, setEditingElement] = useState(null);
  const [optionName, setOptionName] = useState(editingOption?.name || "");

  const handleAddElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      config: {},
    };
    setElements([...elements, newElement]);
  };

  const handleUpdateElement = (updatedElement) => {
    setElements(
      elements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
    );
  };

  const handleDeleteElement = (elementId) => {
    setElements(elements.filter((el) => el.id !== elementId));
    if (editingElement?.id === elementId) {
      setEditingElement(null);
    }
  };

  const renderElementForm = (element) => {
    switch (element.type) {
      case "text":
        return (
          <TextSettings element={element} onUpdate={handleUpdateElement} />
        );
      case "textarea":
        return (
          <TextAreaSettings element={element} onUpdate={handleUpdateElement} />
        );
      case "number":
        return (
          <NumberSettings element={element} onUpdate={handleUpdateElement} />
        );
      case "email":
        return (
          <EmailSettings element={element} onUpdate={handleUpdateElement} />
        );
      case "phone":
        return (
          <PhoneSettings element={element} onUpdate={handleUpdateElement} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-100">
      <div className="border-bottom p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-link p-0" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Option Set Name"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary">
              Frontend Preview
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => onSave({ name: optionName, elements })}
              disabled={!optionName.trim()}
            >
              Save Option ({elements.length})
            </button>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="mb-3">
          <label>Elements</label>
          <button
            className="btn btn-primary btn-sm ms-2"
            onClick={() => handleAddElement("text")}
          >
            Add Element
          </button>
        </div>

        <div className="elements-list">
          {elements.map((element) => (
            <React.Fragment key={element.id}>
              <div className="element-item mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <ElementPreview element={element} />
                  </div>
                  <div className="ms-3">
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() =>
                        setEditingElement(
                          editingElement?.id === element.id ? null : element
                        )
                      }
                    >
                      {editingElement?.id === element.id ? "Close" : "Edit"}
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDeleteElement(element.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Element Form appears right under the element when editing */}
                {editingElement?.id === element.id && (
                  <div className="mt-3 border-top pt-3">
                    {renderElementForm(element)}
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewOptionSet;
