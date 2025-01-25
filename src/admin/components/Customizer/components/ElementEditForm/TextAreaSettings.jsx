import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import ValidationSettings from "./ValidationSettings";
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const TextAreaSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "",
        placeholder: "Enter your text here",
        helpText: "",
        defaultValue: "",
        required: false,
        hideLabel: false,
        readOnly: false,
        rows: "4",
        maxLength: "",
        width: "full", // Added default width
        customWidth: "",
        customWidthUnit: "px",
        resizable: true,
        size: "default"
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
          <label className="form-label">Label</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="Enter label"
          />
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="hideLabel"
              checked={element.config?.hideLabel || false}
              onChange={(e) => handleChange("hideLabel", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="hideLabel">
              Hide Label
            </label>
          </div>
        </div>

        <div className="mb-1">
          <label className="form-label">Placeholder</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.placeholder || ""}
            onChange={(e) => handleChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Help Text</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.helpText || ""}
            onChange={(e) => handleChange("helpText", e.target.value)}
            placeholder="Enter help text"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Default Value</label>
          <textarea
            className="form-control"
            value={element.config?.defaultValue || ""}
            onChange={(e) => handleChange("defaultValue", e.target.value)}
            placeholder="Enter default value"
            rows="3"
          />
        </div>
      </SettingsAccordion>

      {/* Display Settings */}
      <SettingsAccordion 
        title="Display Settings" 
        icon="fa-desktop text-info" 
        eventKey="1"
      >
        <div className="mb-1">
          <label className="form-label">Number of Rows</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.rows || "4"}
            onChange={(e) => handleChange("rows", e.target.value)}
            min="2"
            max="20"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Size</label>
          <select
            className="form-select"
            value={element.config?.size || "default"}
            onChange={(e) => handleChange("size", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="default">Default</option>
            <option value="large">Large</option>
          </select>
        </div>

        {/* Added WidthSettings component */}
        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="resizable"
              checked={element.config?.resizable || false}
              onChange={(e) => handleChange("resizable", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="resizable">
              Allow Resizing
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Validation Settings */}
      <SettingsAccordion 
        title="Validation Settings" 
        icon="fa-check-square-o text-danger" 
        eventKey="2"
      >
        <ValidationSettings
          config={element.config}
          elementType="textarea"
          onChange={handleChange}
        />

        <div className="mb-1">
          <label className="form-label">Maximum Length</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.maxLength || ""}
            onChange={(e) => handleChange("maxLength", e.target.value)}
            min="0"
            placeholder="No limit"
          />
        </div>
      </SettingsAccordion>
    </Accordion>
  );
};

export default TextAreaSettings;
