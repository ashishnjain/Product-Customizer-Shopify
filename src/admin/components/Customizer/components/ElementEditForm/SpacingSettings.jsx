import React, { useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import './TextSettings.css';

const SpacingSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        height: "20",
        heightUnit: "px",
        responsive: false,
        tabletHeight: "15",
        mobileHeight: "10",
        showBorder: false,
        borderStyle: "solid",
        borderColor: "#eeeeee",
        borderWidth: "1",
        customClass: "",
        width: "full",
        customWidth: "",
        customWidthUnit: "px"
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

  return (
    <Accordion defaultActiveKey="0">
      {/* Basic Settings */}
      <SettingsAccordion 
        title="Basic Settings" 
        icon="fa-cog text-warning" 
        eventKey="0"
      >
        <div className="mb-3">
          <label className="form-label">Spacing Height</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={element.config?.height || "20"}
              onChange={(e) => handleChange("height", e.target.value)}
              min="0"
            />
            <select
              className="form-select"
              value={element.config?.heightUnit || "px"}
              onChange={(e) => handleChange("heightUnit", e.target.value)}
            >
              <option value="px">px</option>
              <option value="em">em</option>
              <option value="rem">rem</option>
              <option value="vh">vh</option>
            </select>
          </div>
        </div>

        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />
      </SettingsAccordion>

      {/* Responsive Settings */}
      <SettingsAccordion 
        title="Responsive Settings" 
        icon="fa-mobile text-primary" 
        eventKey="1"
      >
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="responsive"
              checked={element.config?.responsive || false}
              onChange={(e) => handleChange("responsive", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="responsive">
              Enable Responsive Height
            </label>
          </div>
        </div>

        {element.config?.responsive && (
          <>
            <div className="mb-3">
              <label className="form-label">Tablet Height (px)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.tabletHeight || "15"}
                onChange={(e) => handleChange("tabletHeight", e.target.value)}
                min="0"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mobile Height (px)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.mobileHeight || "10"}
                onChange={(e) => handleChange("mobileHeight", e.target.value)}
                min="0"
              />
            </div>
          </>
        )}
      </SettingsAccordion>

      {/* Border Settings */}
      <SettingsAccordion 
        title="Border Settings" 
        icon="fa-ellipsis-h" 
        eventKey="2"
      >
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showBorder"
              checked={element.config?.showBorder || false}
              onChange={(e) => handleChange("showBorder", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showBorder">
              Show Border
            </label>
          </div>
        </div>

        {element.config?.showBorder && (
          <>
            <div className="mb-3">
              <label className="form-label">Border Style</label>
              <select
                className="form-select"
                value={element.config?.borderStyle || "solid"}
                onChange={(e) => handleChange("borderStyle", e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Border Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.borderColor || "#eeeeee"}
                onChange={(e) => handleChange("borderColor", e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Border Width (px)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.borderWidth || "1"}
                onChange={(e) => handleChange("borderWidth", e.target.value)}
                min="1"
                max="10"
              />
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

export default SpacingSettings;
