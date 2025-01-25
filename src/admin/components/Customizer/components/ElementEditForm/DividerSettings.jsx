import React, { useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import './TextSettings.css';

const DividerSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        style: "solid",
        width: "full",
        customWidth: "100",
        customWidthUnit: "%",
        height: "1",
        color: "#cccccc",
        alignment: "center",
        marginTop: "20",
        marginBottom: "20",
        customClass: "",
        hasIcon: false,
        icon: "",
        iconSize: "16",
        iconColor: "#000000",
        iconPosition: "center",
      };
      onUpdate({ ...element, config: initialConfig });
    }
  }, []);

  const handleChange = (field, value) => {
    if (field === "width") {
      const updatedConfig = {
        ...element.config,
        width: value,
        customWidth: value === "full" ? "100" : value === "half" ? "50" : element.config.customWidth || "100",
        customWidthUnit: "%"
      };
      onUpdate({
        ...element,
        config: updatedConfig
      });
      return;
    }

    onUpdate({
      ...element,
      config: {
        ...element.config,
        [field]: value,
      },
    });
  };

  return (
    <Accordion defaultActiveKey="0">
      {/* Style Settings */}
      <SettingsAccordion 
        title="Style Settings" 
        icon="fa-paint-brush text-success" 
        eventKey="0"
      >
        <div className="mb-3">
          <label className="form-label">Line Style</label>
          <select
            className="form-select"
            value={element.config?.style || "solid"}
            onChange={(e) => handleChange("style", e.target.value)}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
            <option value="double">Double</option>
            <option value="groove">Groove</option>
            <option value="ridge">Ridge</option>
          </select>
        </div>

        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />

        <div className="mb-3">
          <label className="form-label">Height (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.height || "1"}
            onChange={(e) => handleChange("height", e.target.value)}
            min="1"
            max="20"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.color || "#cccccc"}
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Alignment</label>
          <select
            className="form-select"
            value={element.config?.alignment || "center"}
            onChange={(e) => handleChange("alignment", e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </SettingsAccordion>

      {/* Spacing Settings */}
      <SettingsAccordion 
        title="Spacing Settings" 
        icon="fa-square-o text-primary" 
        eventKey="1"
      >
        <div className="mb-3">
          <label className="form-label">Top Margin (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.marginTop || "20"}
            onChange={(e) => handleChange("marginTop", e.target.value)}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Bottom Margin (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.marginBottom || "20"}
            onChange={(e) => handleChange("marginBottom", e.target.value)}
            min="0"
          />
        </div>
      </SettingsAccordion>

      {/* Icon Settings */}
      <SettingsAccordion 
        title="Icon Settings" 
        icon="fa-ravelry text-secondary" 
        eventKey="2"
      >
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="hasIcon"
              checked={element.config?.hasIcon || false}
              onChange={(e) => handleChange("hasIcon", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="hasIcon">
              Add Icon
            </label>
          </div>
        </div>

        {element.config?.hasIcon && (
          <>
            <div className="mb-3">
              <label className="form-label">Icon</label>
              <input
                type="text"
                className="form-control"
                value={element.config?.icon || ""}
                onChange={(e) => handleChange("icon", e.target.value)}
                placeholder="Enter icon class or name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Icon Size (px)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.iconSize || "16"}
                onChange={(e) => handleChange("iconSize", e.target.value)}
                min="8"
                max="48"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Icon Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.iconColor || "#000000"}
                onChange={(e) => handleChange("iconColor", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Icon Position</label>
              <select
                className="form-select"
                value={element.config?.iconPosition || "center"}
                onChange={(e) => handleChange("iconPosition", e.target.value)}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}
      </SettingsAccordion>

      {/* Additional Settings */}
      <SettingsAccordion 
        title="Additional Settings" 
        icon="fa-sliders text-info" 
        eventKey="3"
      >
        <div className="mb-3">
          <label className="form-label">Custom CSS Class</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.customClass || ""}
            onChange={(e) => handleChange("customClass", e.target.value)}
            placeholder="Enter custom CSS class"
          />
        </div>
      </SettingsAccordion>
    </Accordion>
  );
};

export default DividerSettings;
