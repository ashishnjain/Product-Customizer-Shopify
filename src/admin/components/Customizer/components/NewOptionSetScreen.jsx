import React, { useState } from "react";
import ElementPreview from "./ElementPreview";
import ElementEditForm from "./ElementEditForm";
import ElementSelectionModal from "./ElementSelectionModal";
import { Type, AlignLeft, Hash, Phone, Mail, Calendar, Upload, Eye, CheckSquare, Radio, Square, FileText, Box, Minus } from "lucide-react";
import FrontendPreviewModal from "../../../../frontend/pages/products/FrontendPreviewModal";

const NewOptionSetScreen = ({
  editingOptionSet,
  onBack,
  onSave,
  isEditing,
}) => {
  const [elements, setElements] = useState(editingOptionSet?.elements || []);
  const [optionName, setOptionName] = useState(editingOptionSet?.name || "");
  const [editingElementIndex, setEditingElementIndex] = useState(null);
  const [showElementModal, setShowElementModal] = useState(false);
  const [showFrontendPreview, setShowFrontendPreview] = useState(false);

  const handleSaveOption = () => {
    const newOption = {
      id: editingOptionSet?.id || Date.now(),
      name: optionName || "Untitled Option Set",
      elements: elements,
      createdAt: editingOptionSet?.createdAt || new Date().toISOString(),
    };

    console.log("Saving option:", newOption);
    onSave(newOption);
  };

  const handleAddElement = (elementType) => {
    const newElement = {
      id: Date.now(),
      type: elementType,
      config: {
        basic: {
          label: "",
          placeholder: "",
          helpText: "",
          size: "medium",
        },
      },
    };

    setElements([...elements, newElement]);
    setEditingElementIndex(elements.length);
    setShowElementModal(false);
  };

  const handleElementUpdate = (updatedElement) => {
    const newElements = [...elements];
    newElements[editingElementIndex] = updatedElement;
    setElements(newElements);
  };

  const handleDeleteElement = (index) => {
    const newElements = elements.filter((_, i) => i !== index);
    setElements(newElements);
    setEditingElementIndex(null);
  };

  const handlePreviewClick = () => {
    console.log("Elements being passed to preview:", elements);
    setShowFrontendPreview(true);
  };

  const getElementIcon = (type) => {
    const icons = {
      text: <Type size={18} className="text-primary" />,
      textarea: <AlignLeft size={18} className="text-success" />,
      number: <Hash size={18} className="text-purple" />,
      phone: <Phone size={18} className="text-danger" />,
      email: <Mail size={18} className="text-warning" />,
      hidden: <Eye size={18} className="text-secondary" />,
      datetime: <Calendar size={18} className="text-info" />,
      file: <Upload size={18} className="text-dark" />,
      select: <Box size={18} className="text-teal" />,
      dropdown: <Box size={18} className="text-teal" />,
      'image-dropdown': <FileText size={18} className="text-primary" />,
      radio: <Radio size={18} className="text-pink" />,
      checkbox: <CheckSquare size={18} className="text-info" />,
      button: <Square size={18} className="text-orange" />,
      heading: <Type size={18} className="text-purple" />,
      divider: <Minus size={18} className="text-secondary" />,
      spacing: <Box size={18} className="text-success" />
    };
    return icons[type] || null;
  };

  return (
    <div className="h-100">
      <div className="border-bottom p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-secondary" onClick={onBack}>
              <i className="fa fa-angle-left" aria-hidden="true">
                &nbsp;&nbsp;Back
              </i>
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
            <button className="btn text-white" style={{backgroundColor: '#50b1be'}} onClick={handlePreviewClick}>
              Frontend Preview
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSaveOption}
              disabled={!optionName.trim() || elements.length === 0}
            >
              {isEditing ? "Update Option" : "Save Option"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="row d-flex h-100 position-relative">
        {/* Left Panel */}
        <div className="border-end col-10 col-md-6 mx-auto">
          <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Elements</h4>
              <button
                className="btn btn-success btn-sm"
                onClick={() => setShowElementModal(true)}
              >
                Add Element
              </button>
            </div>

            {/* Elements List */}
            <div className="elements-list">
              {elements.map((element, index) => (
                <React.Fragment key={element.id}>
                  <div className={`element-item ${editingElementIndex === index ? "active" : ""}`}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2" 
                           onClick={() => setEditingElementIndex(index)}>
                        <span className="element-icon">
                          {getElementIcon(element.type)}
                        </span>
                        <span className="fs-6">
                          {element.config.basic.label || `New ${element.type}`}
                        </span>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn p-0"
                          onClick={() => setEditingElementIndex(index)}
                        >
                          <i className="fa fa-pencil-square text-warning fs-5"></i>
                        </button>
                        <button
                          className="btn p-0"
                          onClick={() => handleDeleteElement(index)}
                        >
                          <i className="fa fa-trash-o text-danger fs-5"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Edit Form - Rendered inline below the active element */}
                  {editingElementIndex === index && (
                    <div className="ms-3 border-start ps-3 my-2">
                      <ElementEditForm
                        element={element}
                        onUpdate={handleElementUpdate}
                        onClose={() => setEditingElementIndex(null)}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="overflow-auto col-10 col-md-6 mx-auto position-sticky top-0">
          <div className="flex-grow-1">
            <div className="p-3">
              <div className="preview-card">
                <h6 className="mb-3">CUSTOMISE</h6>
                {elements.length === 0 ? (
                  <div className="text-muted text-center py-5">
                    No options added yet
                  </div>
                ) : (
                  <div className="preview-content">
                    {elements.map((element) => (
                      <ElementPreview key={element.id} element={element} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Element Selection Modal */}
      {showElementModal && (
        <ElementSelectionModal
          onClose={() => setShowElementModal(false)}
          onSelectElement={handleAddElement}
        />
      )}

      {showFrontendPreview && (
        <FrontendPreviewModal
          elements={elements}
          onClose={() => setShowFrontendPreview(false)}
        />
      )}
    </div>
  );
};

export default NewOptionSetScreen;
