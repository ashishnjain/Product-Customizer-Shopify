import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const EmailSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "",
        placeholder: "Enter email",
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
          pattern: "",
          allowedDomains: [],
          blockDomains: [],
          confirmEmail: false,
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
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={element.config?.validation?.confirmEmail || false}
              onChange={(e) =>
                handleValidationChange("confirmEmail", e.target.checked)
              }
              id="confirmEmail"
            />
            <label className="form-check-label" htmlFor="confirmEmail">
              Require Email Confirmation
            </label>
          </div>
        </div>

        <div className="mb-1">
          <label className="form-label">
            Allowed Domains (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            value={element.config?.validation?.allowedDomains?.join(", ") || ""}
            onChange={(e) =>
              handleValidationChange(
                "allowedDomains",
                e.target.value.split(",").map((d) => d.trim())
              )
            }
            placeholder="example.com, another.com"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">
            Blocked Domains (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            value={element.config?.validation?.blockDomains?.join(", ") || ""}
            onChange={(e) =>
              handleValidationChange(
                "blockDomains",
                e.target.value.split(",").map((d) => d.trim())
              )
            }
            placeholder="spam.com, temp.com"
          />
        </div>
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

export default EmailSettings;
