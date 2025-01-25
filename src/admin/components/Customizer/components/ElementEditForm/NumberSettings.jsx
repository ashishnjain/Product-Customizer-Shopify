import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const NumberSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "",
        placeholder: "Enter number",
        helpText: "",
        defaultValue: "",
        required: false,
        hideLabel: false,
        readOnly: false,
        size: "default",
        width: "full",
        customWidth: "",
        customWidthUnit: "px",
        validation: {
          min: "",
          max: "",
          step: "1",
          allowDecimals: false,
          decimalPlaces: "2",
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
            placeholder="Enter placeholder"
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
            type="number"
            className="form-control"
            value={element.config?.defaultValue || ""}
            onChange={(e) => handleChange("defaultValue", e.target.value)}
            placeholder="Enter default value"
          />
        </div>
      </SettingsAccordion>

      {/* Validation Settings */}
      <SettingsAccordion 
        title="Validation Settings" 
        icon="fa-check-square-o text-danger" 
        eventKey="1"
      >
        <div className="mb-1">
          <label className="form-label">Minimum Value</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.validation?.min || ""}
            onChange={(e) => handleValidationChange("min", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Maximum Value</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.validation?.max || ""}
            onChange={(e) => handleValidationChange("max", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Step</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.validation?.step || "1"}
            onChange={(e) => handleValidationChange("step", e.target.value)}
            min="0.01"
          />
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={element.config?.validation?.allowDecimals || false}
              onChange={(e) =>
                handleValidationChange("allowDecimals", e.target.checked)
              }
              id="allowDecimals"
            />
            <label className="form-check-label" htmlFor="allowDecimals">
              Allow Decimals
            </label>
          </div>
        </div>

        {element.config?.validation?.allowDecimals && (
          <div className="mb-1">
            <label className="form-label">Decimal Places</label>
            <input
              type="number"
              className="form-control"
              value={element.config?.validation?.decimalPlaces || "2"}
              onChange={(e) =>
                handleValidationChange("decimalPlaces", e.target.value)
              }
              min="0"
              max="10"
            />
          </div>
        )}
      </SettingsAccordion>

      {/* Display Settings */}
      <SettingsAccordion 
        title="Display Settings" 
        icon="fa-desktop text-info" 
        eventKey="2"
      >
        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={element.config?.required || false}
              onChange={(e) => handleChange("required", e.target.checked)}
              id="required"
            />
            <label className="form-check-label" htmlFor="required">
              Required
            </label>
          </div>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={element.config?.readOnly || false}
              onChange={(e) => handleChange("readOnly", e.target.checked)}
              id="readOnly"
            />
            <label className="form-check-label" htmlFor="readOnly">
              Read Only
            </label>
          </div>
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

        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />
      </SettingsAccordion>
    </Accordion>
  );
};

export default NumberSettings;
