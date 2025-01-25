import React from 'react';

export const AdvancedSettings = ({ config, onChange }) => {
  if (!config) return <div>No configuration available</div>;

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Column Width</label>
        <select
          className="form-select"
          value={config.columnWidth || "100"}
          onChange={(e) => onChange('columnWidth', e.target.value)}
        >
          <option value="25">25%</option>
          <option value="33.33">33.33%</option>
          <option value="50">50%</option>
          <option value="66.66">66.66%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">HTML Class</label>
        <input
          type="text"
          className="form-control"
          value={config.htmlClass}
          onChange={(e) => onChange('htmlClass', e.target.value)}
          placeholder="Custom CSS classes"
        />
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="hiddenLabel"
            checked={config.hiddenLabel}
            onChange={(e) => onChange('hiddenLabel', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="hiddenLabel">
            Hidden Label
          </label>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Add-on Product</label>
        <select
          className="form-select"
          value={config.addonProduct}
          onChange={(e) => onChange('addonProduct', e.target.value)}
        >
          <option value="">None</option>
          <option value="product1">Product 1</option>
          <option value="product2">Product 2</option>
          <option value="product3">Product 3</option>
        </select>
      </div>

      {config.addonProduct && (
        <div className="mb-3">
          <label className="form-label">Add-on Behavior</label>
          <select
            className="form-select"
            value={config.advancedAddOn}
            onChange={(e) => onChange('advancedAddOn', e.target.value)}
          >
            <option value="default">Default</option>
            <option value="required">Required</option>
            <option value="optional">Optional</option>
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Custom Placeholder</label>
        <input
          type="text"
          className="form-control"
          value={config.placeholder || ''}
          onChange={(e) => onChange('placeholder', e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdvancedSettings;