import React from "react";
import { Accordion } from 'react-bootstrap';
import ValidationSettings from "./ValidationSettings";
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const DateTimeSettings = ({ element, onUpdate }) => {
  const handleChange = (field, value) => {
    // Validate date ranges
    if (field === "minDate" || field === "maxDate") {
      const minDate = field === "minDate" ? value : element.config.minDate;
      const maxDate = field === "maxDate" ? value : element.config.maxDate;

      if (minDate && maxDate && new Date(minDate) > new Date(maxDate)) {
        alert("Minimum date cannot be greater than maximum date");
        return;
      }
    }

    // Validate past/future date settings
    if (field === "disablePastDates" && value && element.config.disableFutureDates) {
      alert("Cannot disable both past and future dates");
      return;
    }

    if (field === "disableFutureDates" && value && element.config.disablePastDates) {
      alert("Cannot disable both past and future dates");
      return;
    }

    const updatedElement = {
      ...element,
      config: {
        ...element.config,
        [field]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const handleValidationChange = (field, value) => {
    handleChange(field, value);
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
          <label className="form-label">Default Value</label>
          <input
            type="datetime-local"
            className="form-control"
            value={element.config?.defaultValue || ""}
            onChange={(e) => handleChange("defaultValue", e.target.value)}
          />
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
      </SettingsAccordion>

      {/* Validation Settings */}
      <SettingsAccordion 
        title="Validation Settings" 
        icon="fa-check-square-o text-danger" 
        eventKey="1"
      >
        <ValidationSettings
          config={element.config}
          elementType="datetime"
          onChange={handleValidationChange}
        />

        <div className="mb-1">
          <label className="form-label">Minimum Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={element.config?.minDate || ""}
            onChange={(e) => handleChange("minDate", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Maximum Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={element.config?.maxDate || ""}
            onChange={(e) => handleChange("maxDate", e.target.value)}
          />
        </div>
      </SettingsAccordion>

      {/* Format Settings */}
      <SettingsAccordion 
        title="Format Settings" 
        icon="fa-calendar text-primary" 
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Date Format</label>
          <select
            className="form-select"
            value={element.config?.dateFormat || "YYYY-MM-DD"}
            onChange={(e) => handleChange("dateFormat", e.target.value)}
          >
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
            <option value="MM-DD-YYYY">MM-DD-YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Time Format</label>
          <select
            className="form-select"
            value={element.config?.timeFormat || "24"}
            onChange={(e) => handleChange("timeFormat", e.target.value)}
          >
            <option value="24">24-hour (HH:mm)</option>
            <option value="12">12-hour (hh:mm AM/PM)</option>
          </select>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showSeconds"
              checked={element.config?.showSeconds || false}
              onChange={(e) => handleChange("showSeconds", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showSeconds">
              Show Seconds
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Advanced Settings */}
      <SettingsAccordion 
        title="Advanced Settings" 
        icon="fa-sliders text-info" 
        eventKey="3"
      >
        <div className="mb-1">
          <label className="form-label">Display Mode</label>
          <select
            className="form-select"
            value={element.config?.displayMode || "both"}
            onChange={(e) => handleChange("displayMode", e.target.value)}
          >
            <option value="both">Date and Time</option>
            <option value="date">Date Only</option>
            <option value="time">Time Only</option>
          </select>
        </div>

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

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="disablePastDates"
              checked={element.config?.disablePastDates || false}
              onChange={(e) => handleChange("disablePastDates", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="disablePastDates">
              Disable Past Dates
            </label>
          </div>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="disableFutureDates"
              checked={element.config?.disableFutureDates || false}
              onChange={(e) => handleChange("disableFutureDates", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="disableFutureDates">
              Disable Future Dates
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Style Settings */}
      <SettingsAccordion 
        title="Style Settings" 
        icon="fa-paint-brush text-success" 
        eventKey="4"
      >
        <div className="mb-1">
          <label className="form-label">Input Size</label>
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

export default DateTimeSettings;
