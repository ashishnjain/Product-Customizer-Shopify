import React, { useState } from "react";
import { settingsConfig } from "./configs/settingsConfig";

const SettingsPanel = ({ element, onUpdate }) => {
  const [activeTab, setActiveTab] = useState("basic");

  const handleSettingChange = (section, field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        [section]: {
          ...element.config[section],
          [field]: value,
        },
      },
    });
  };

  const renderField = (field, section) => {
    const value = element.config[section]?.[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={(e) =>
              handleSettingChange(section, field.name, e.target.value)
            }
            placeholder={field.placeholder}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="form-control"
            value={value}
            min={field.min}
            max={field.max}
            onChange={(e) =>
              handleSettingChange(section, field.name, e.target.value)
            }
          />
        );

      case "checkbox":
        return (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={value}
              onChange={(e) =>
                handleSettingChange(section, field.name, e.target.checked)
              }
            />
          </div>
        );

      case "select":
        return (
          <select
            className="form-select"
            value={value}
            onChange={(e) =>
              handleSettingChange(section, field.name, e.target.value)
            }
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  const config = settingsConfig[element.type];
  if (!config) return <div>No settings available for this element type</div>;

  return (
    <div className="settings-panel">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "validation" ? "active" : ""}`}
            onClick={() => setActiveTab("validation")}
          >
            Validation
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "advanced" ? "active" : ""}`}
            onClick={() => setActiveTab("advanced")}
          >
            Advanced
          </button>
        </li>
      </ul>

      <div className="settings-content p-3">
        {config[activeTab].fields.map((field, index) => (
          <div key={index} className="mb-3">
            <label className="form-label d-flex justify-content-between">
              {field.label}
              {field.tooltip && (
                <span className="text-muted" title={field.tooltip}>
                  <i className="bi bi-info-circle"></i>
                </span>
              )}
            </label>
            {renderField(field, activeTab)}
            {field.helpText && (
              <div className="form-text text-muted small">{field.helpText}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
