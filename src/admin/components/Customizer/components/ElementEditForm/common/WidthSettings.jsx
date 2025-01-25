import React from 'react';

const WidthSettings = ({ config, onChange }) => {
  return (
    <>
      <div className="mb-1">
        <label className="form-label">Width</label>
        <select
          className="form-select"
          value={config?.width || "full"}
          onChange={(e) => onChange("width", e.target.value)}
        >
          <option value="full">Full Width</option>
          <option value="half">Half Width</option>
          <option value="custom">Custom Width</option>
        </select>
      </div>

      {config?.width === "custom" && (
        <div className="mb-1">
          <label className="form-label">Custom Width</label>
          <div className="custom-width-input">
            <input
              type="number"
              className="form-control"
              value={config?.customWidth || ""}
              onChange={(e) => onChange("customWidth", e.target.value)}
              placeholder="Enter width"
              min="1"
            />
            <select
              className="form-select"
              value={config?.customWidthUnit || "px"}
              onChange={(e) => onChange("customWidthUnit", e.target.value)}
            >
              <option value="px">px</option>
              <option value="%">%</option>
              <option value="em">em</option>
              <option value="rem">rem</option>
            </select>
          </div>
          <small className="form-text text-muted">
            Enter a value and select a unit for custom width
          </small>
        </div>
      )}
    </>
  );
};

export default WidthSettings; 