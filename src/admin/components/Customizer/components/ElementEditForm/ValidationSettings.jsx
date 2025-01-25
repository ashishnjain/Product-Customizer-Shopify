import React from "react";

const ValidationSettings = ({ config, elementType, onChange }) => {
  if (!config) return <div>No configuration available</div>; // Handle undefined case

  return (
    <div className="validation-settings">
      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="required"
            checked={config.required || false} // Default to false
            onChange={(e) => onChange("required", e.target.checked)}
          />
          <label className="form-check-label" htmlFor="required">
            Required Field
          </label>
        </div>
      </div>

      {(elementType === "text" || elementType === "textarea") && (
        <>
          <div className="mb-3">
            <label className="form-label">Minimum Length</label>
            <input
              type="number"
              className="form-control"
              value={config.minLength}
              onChange={(e) => onChange("minLength", parseInt(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Maximum Length</label>
            <input
              type="number"
              className="form-control"
              value={config.maxLength}
              onChange={(e) => onChange("maxLength", parseInt(e.target.value))}
            />
          </div>
        </>
      )}

      {elementType === "checkbox" && (
        <>
          <div className="mb-3">
            <label className="form-label">Minimum Selections</label>
            <input
              type="number"
              className="form-control"
              value={config.minSelect}
              onChange={(e) => onChange("minSelect", parseInt(e.target.value))}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Maximum Selections</label>
            <input
              type="number"
              className="form-control"
              value={config.maxSelect}
              onChange={(e) => onChange("maxSelect", parseInt(e.target.value))}
            />
          </div>
        </>
      )}

      <div className="mb-3">
        <label className="form-label">Error Message</label>
        <input
          type="text"
          className="form-control"
          value={config.errorMessage}
          onChange={(e) => onChange("errorMessage", e.target.value)}
          placeholder="Custom error message"
        />
      </div>
    </div>
  );
};

export default ValidationSettings;
