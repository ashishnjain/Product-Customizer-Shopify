import React from "react";

const CommonSettings = ({ element, onUpdate }) => {
  const handleWidthChange = (value) => {
    const updatedConfig = {
      ...element.config,
      width: value,
      style: {
        ...element.config?.style,
        width: value === "auto" ? "auto" : `${value}%`,
      },
    };
    onUpdate({ ...element, config: updatedConfig });
  };

  return (
    <div className="common-settings mt-3">
      <h6 className="settings-section-title">Layout Settings</h6>
      <div className="form-group">
        <label className="form-label">Width</label>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select"
            value={element.config?.width || "auto"}
            onChange={(e) => handleWidthChange(e.target.value)}
          >
            <option value="auto">Auto</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
          </select>
          {element.config?.width !== "auto" && (
            <input
              type="number"
              className="form-control"
              min="1"
              max="100"
              value={element.config?.width || "100"}
              onChange={(e) => handleWidthChange(e.target.value)}
              style={{ width: "80px" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommonSettings;
