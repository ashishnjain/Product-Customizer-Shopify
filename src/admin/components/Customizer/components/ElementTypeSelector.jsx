import React from "react";
import { Type, AlignLeft, Hash, Phone, Mail, Calendar } from "lucide-react";

const elementTypes = [
  { icon: <Type size={20} />, label: "Text", type: "text" },
  { icon: <AlignLeft size={20} />, label: "Textarea", type: "textarea" },
  { icon: <Hash size={20} />, label: "Number", type: "number" },
  { icon: <Phone size={20} />, label: "Phone", type: "phone" },
  { icon: <Mail size={20} />, label: "Email", type: "email" },
  { icon: <Calendar size={20} />, label: "Date", type: "date" },
];

const ElementTypeSelector = ({ onSelectElement }) => (
  <div className="p-4">
    <h6 className="mb-3">Select an Element Type</h6>
    <div className="row g-2">
      {elementTypes.map((item) => (
        <div className="col-4" key={item.type}>
          <button
            onClick={() => onSelectElement(item.type)}
            className="btn btn-outline-secondary w-100 p-2"
          >
            <div className="d-flex flex-column align-items-center">
              {item.icon}
              <span className="small mt-1">{item.label}</span>
            </div>
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ElementTypeSelector;
