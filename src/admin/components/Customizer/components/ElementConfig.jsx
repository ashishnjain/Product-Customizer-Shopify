import React from "react";
import { elementConfigs } from "./configs/elementConfigs";

const ElementConfig = ({ element, onUpdate }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onUpdate({
      ...element.config,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Get element specific config
  const elementConfig = elementConfigs[element.type];
  if (!elementConfig) {
    return <div>Unsupported element type</div>;
  }

  const renderBasicSettings = () => {
    return (
      <>
        {/* Common settings for all elements */}
        <div className="mb-3">
          <label className="form-label">Label</label>
          <input
            type="text"
            className="form-control"
            name="label"
            value={element.config.label || ""}
            onChange={handleChange}
          />
        </div>

        {/* Element specific settings */}
        {elementConfig.renderBasicSettings?.(element.config, handleChange)}
      </>
    );
  };

  const renderValidationSettings = () => {
    return (
      <>
        {/* Common validation settings */}
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="required"
              checked={element.config.required || false}
              onChange={handleChange}
            />
            <label className="form-check-label">Required field</label>
          </div>
        </div>

        {/* Element specific validation settings */}
        {elementConfig.renderValidationSettings?.(element.config, handleChange)}
      </>
    );
  };

  const renderAdvancedSettings = () => {
    return (
      <>
        {/* Common advanced settings */}
        <div className="mb-3">
          <label className="form-label">Column Width</label>
          <select
            className="form-select"
            name="columnWidth"
            value={element.config.columnWidth || "100"}
            onChange={handleChange}
          >
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
        </div>

        {/* Element specific advanced settings */}
        {elementConfig.renderAdvancedSettings?.(element.config, handleChange)}
      </>
    );
  };

  return (
    <div className="element-config">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className="nav-link active">Basic Settings</button>
        </li>
        <li className="nav-item">
          <button className="nav-link">Validation</button>
        </li>
        <li className="nav-item">
          <button className="nav-link">Advanced</button>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane active">{renderBasicSettings()}</div>
        <div className="tab-pane">{renderValidationSettings()}</div>
        <div className="tab-pane">{renderAdvancedSettings()}</div>
      </div>
    </div>
  );
};

export default ElementConfig;
