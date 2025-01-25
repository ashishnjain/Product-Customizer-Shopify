import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import ValidationSettings from "./ValidationSettings";
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const TextSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "",
        placeholder: "Enter text",
        helpText: "",
        defaultValue: "",
        required: false,
        hideLabel: false,
        readOnly: false,
        type: "text",
        size: "default",
        width: "full", // Added default width
        customWidth: "",
        customWidthUnit: "px",
        validation: {
          pattern: "",
          minLength: "",
          maxLength: "",
        },
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

  const handleValidationChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        validation: {
          ...element.config.validation,
          [field]: value,
        },
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
          <input
            type="text"
            className="form-control"
            value={element.config?.defaultValue || ""}
            onChange={(e) => handleChange("defaultValue", e.target.value)}
            placeholder="Enter default value"
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
          <label className="form-label">Input Type</label>
          <select
            className="form-select"
            value={element.config?.type || "text"}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="text">Text</option>
            <option value="password">Password</option>
            <option value="email">Email</option>
            <option value="url">URL</option>
            <option value="search">Search</option>
          </select>
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
              id="readOnly"
              checked={element.config?.readOnly || false}
              onChange={(e) => handleChange("readOnly", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="readOnly">
              Read Only
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
          elementType="text"
          onChange={handleChange}
        />

        <div className="mb-1">
          <label className="form-label">Pattern (Regex)</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.validation?.pattern || ""}
            onChange={(e) => handleValidationChange("pattern", e.target.value)}
            placeholder="Enter regex pattern"
          />
        </div>
      </SettingsAccordion>
    </Accordion>
  );
};

export default TextSettings;
