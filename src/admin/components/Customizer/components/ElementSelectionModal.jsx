import React from "react";
import {
  Type,
  AlignLeft,
  Hash,
  Phone,
  Mail,
  Calendar,
  Upload,
  Eye,
  CheckSquare,
  Radio,
  Square,
  FileText,
  Box,
  Link,
  Minus
} from "lucide-react";

const ElementSelectionModal = ({ onClose, onSelectElement }) => {
  const elements = {
    input: [
      { icon: <Type size={20} />, label: "Text", value: "text" },
      { icon: <AlignLeft size={20} />, label: "Textarea", value: "textarea" },
      { icon: <Hash size={20} />, label: "Number", value: "number" },
      {
        icon: <Phone size={20} />,
        label: "Phone",
        value: "phone",
        premium: true,
      },
      {
        icon: <Mail size={20} />,
        label: "Email",
        value: "email",
        premium: true,
      },
      {
        icon: <Eye size={20} />,
        label: "Hidden Field",
        value: "hidden",
        premium: true,
      },
      { icon: <Calendar size={20} />, label: "Datetime", value: "datetime" },
      { icon: <Upload size={20} />, label: "File Upload", value: "file" },
    ],
    selection: [
      { icon: <Box size={20} />, label: "Select", value: "select" },
      { icon: <Box size={20} />, label: "Dropdown", value: "dropdown" },
      {
        icon: <FileText size={20} />,
        label: "Image Dropdown",
        value: "image-dropdown",
        premium: true,
      },
      { icon: <Radio size={20} />, label: "Radio Button", value: "radio" },
      { icon: <CheckSquare size={20} />, label: "Checkbox", value: "checkbox" },
      { icon: <Square size={20} />, label: "Button", value: "button" },
    ],
    static: [
      { icon: <Type size={20} />, label: "Heading", value: "heading" },
      { icon: <Minus size={20} />, label: "Divider", value: "divider" },
      { icon: <Box size={20} />, label: "Spacing", value: "spacing" },
      {
        icon: <Link size={20} />,
        label: "Redirect Product Links",
        value: "redirect",
        premium: true,
      },
    ],
  };

  return (
    <div className="modal-backdrop ">
      <div className="element-selection-modal w-auto">
        <div className="modal-content bg-white border-0 shadow-lg p-3 rounded-4">
          <div className="modal-header border-bottom d-flex justify-content-between p-3 m-0">
            <h5 className="modal-title fw-bold">Add Element</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="row g-4">
              {Object.entries(elements).map(([category, items]) => (
                <div key={category} className="col-md-4 mt-0">
                  <h6 className="section-heading mb-4 text-capitalize">{category}</h6>
                  <div className="d-flex flex-column gap-2">
                    {items.map((element) => (
                      <button
                        key={element.value}
                        className={`element-btn btn text-start d-flex align-items-center gap-2 p-3 ${
                          element.premium ? 'premium-element' : ''
                        }`}
                        onClick={() => !element.premium && onSelectElement(element.value)}
                        disabled={element.premium}
                        title={element.premium ? "This is a premium feature" : ""}
                      >
                        <span className={`icon-wrapper icon-${element.value}`}>
                          {element.icon}
                        </span>
                        <span className="flex-grow-1">{element.label}</span>
                        {element.premium && (
                          <span className="premium-badge">PRO</span>
                        )}
                      </button>
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

export default ElementSelectionModal;
