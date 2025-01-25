import React, { useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import './TextSettings.css';

const ButtonSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "Submit",
        buttonText: "Submit",
        action: "submit",
        buttonStyle: "filled",
        buttonSize: "medium",
        width: "full",
        customWidth: "",
        customWidthUnit: "px",
        alignment: "left",
        icon: "",
        iconPosition: "left",
        confirmationMessage: "",
        backgroundColor: "#000000",
        textColor: "#ffffff",
        borderColor: "#000000",
        hoverBackgroundColor: "#333333",
        hoverTextColor: "#ffffff",
        hoverBorderColor: "#333333",
        borderRadius: "4",
        borderWidth: "1",
      };
      onUpdate({ ...element, config: initialConfig });
    }
  }, []);

  const handleChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        [field]: value,
      },
    });
  };

  return (
    <Accordion defaultActiveKey="0">
      {/* Basic Settings */}
      <SettingsAccordion 
        title="Basic Settings" 
        icon="fa-cog text-warning" 
        eventKey="0"
      >
        <div className="mb-1">
          <label className="form-label">Button Text</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.buttonText || ""}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            placeholder="Enter button text"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Action</label>
          <select
            className="form-select"
            value={element.config?.action || "submit"}
            onChange={(e) => handleChange("action", e.target.value)}
          >
            <option value="submit">Submit Form</option>
            <option value="next">Next Step</option>
            <option value="prev">Previous Step</option>
            <option value="reset">Reset Form</option>
            <option value="custom">Custom Action</option>
          </select>
        </div>

        {element.config?.action === "custom" && (
          <div className="mb-1">
            <label className="form-label">Custom Action Handler</label>
            <input
              type="text"
              className="form-control"
              value={element.config?.customAction || ""}
              onChange={(e) => handleChange("customAction", e.target.value)}
              placeholder="Enter custom action name"
            />
          </div>
        )}

        <div className="mb-1">
          <label className="form-label">Confirmation Message</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.confirmationMessage || ""}
            onChange={(e) => handleChange("confirmationMessage", e.target.value)}
            placeholder="Enter confirmation message"
          />
        </div>
      </SettingsAccordion>

      {/* Style Settings */}
      <SettingsAccordion 
        title="Style Settings" 
        icon="fa-paint-brush text-success" 
        eventKey="1"
      >
        <div className="mb-1">
          <label className="form-label">Button Style</label>
          <select
            className="form-select"
            value={element.config?.buttonStyle || "filled"}
            onChange={(e) => handleChange("buttonStyle", e.target.value)}
          >
            <option value="filled">Filled</option>
            <option value="outline">Outline</option>
            <option value="text">Text Only</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Size</label>
          <select
            className="form-select"
            value={element.config?.buttonSize || "medium"}
            onChange={(e) => handleChange("buttonSize", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />

        <div className="mb-1">
          <label className="form-label">Alignment</label>
          <select
            className="form-select"
            value={element.config?.alignment || "left"}
            onChange={(e) => handleChange("alignment", e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>

        {/* Color Settings */}
        <div className="mb-1">
          <label className="form-label">Background Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.backgroundColor || "#000000"}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Text Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.textColor || "#ffffff"}
            onChange={(e) => handleChange("textColor", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Border Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.borderColor || "#000000"}
            onChange={(e) => handleChange("borderColor", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Border Radius (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.borderRadius || "4"}
            onChange={(e) => handleChange("borderRadius", e.target.value)}
            min="0"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Border Width (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.borderWidth || "1"}
            onChange={(e) => handleChange("borderWidth", e.target.value)}
            min="0"
          />
        </div>
      </SettingsAccordion>

      {/* Icon Settings */}
      <SettingsAccordion 
        title="Icon Settings" 
        icon="fa-ravelry text-info" 
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Icon</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.icon || ""}
            onChange={(e) => handleChange("icon", e.target.value)}
            placeholder="Enter icon class or name"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Icon Position</label>
          <select
            className="form-select"
            value={element.config?.iconPosition || "left"}
            onChange={(e) => handleChange("iconPosition", e.target.value)}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </SettingsAccordion>

      {/* Hover Settings */}
      <SettingsAccordion 
        title="Hover Settings" 
        icon="fa-mouse-pointer text-primary" 
        eventKey="3"
      >
        <div className="mb-1">
          <label className="form-label">Hover Background Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.hoverBackgroundColor || "#333333"}
            onChange={(e) => handleChange("hoverBackgroundColor", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Hover Text Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.hoverTextColor || "#ffffff"}
            onChange={(e) => handleChange("hoverTextColor", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Hover Border Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.hoverBorderColor || "#333333"}
            onChange={(e) => handleChange("hoverBorderColor", e.target.value)}
          />
        </div>
      </SettingsAccordion>
    </Accordion>
  );
};

export default ButtonSettings;
