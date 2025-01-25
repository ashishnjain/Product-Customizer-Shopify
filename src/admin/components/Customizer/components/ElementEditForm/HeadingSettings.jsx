import React, { useEffect } from "react";
import { Accordion } from "react-bootstrap";
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from "./common/WidthSettings";
import "./TextSettings.css";

const HeadingSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        text: "Heading",
        level: "h2",
        alignment: "left",
        color: "#000000",
        fontSize: "24",
        fontWeight: "600",
        marginTop: "0",
        marginBottom: "20",
        customClass: "",
        showDivider: false,
        dividerStyle: "solid",
        dividerColor: "#cccccc",
        dividerWidth: "100",
        dividerHeight: "1",
        width: "full",
        customWidth: "",
        customWidthUnit: "px",
      };
      onUpdate({ ...element, config: initialConfig });
    }
  }, []);

  const handleChange = (field, value) => {
    console.log("Heading level changed:", field, value);
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
        <div className="mb-1">
          <label className="form-label">Heading Text</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.text || ""}
            onChange={(e) => handleChange("text", e.target.value)}
            placeholder="Enter heading text"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Heading Level</label>
          <select
            className="form-select"
            value={element.config?.level || "h2"}
            onChange={(e) => handleChange("level", e.target.value)}
          >
            <option value="h1">H1 - Main Heading</option>
            <option value="h2">H2 - Section Heading</option>
            <option value="h3">H3 - Subsection Heading</option>
            <option value="h4">H4 - Group Heading</option>
            <option value="h5">H5 - Small Heading</option>
            <option value="h6">H6 - Smallest Heading</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Alignment</label>
          <select
            className="form-select"
            value={element.config?.alignment || "left"}
            onChange={(e) => handleChange("alignment", e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </SettingsAccordion>

      {/* Style Settings */}
      <SettingsAccordion
        title="Style Settings"
        icon="fa-paint-brush text-success"
        eventKey="1"
      >
        <div className="mb-1">
          <label className="form-label">Text Color</label>
          <input
            type="color"
            className="form-control form-control-color"
            value={element.config?.color || "#000000"}
            onChange={(e) => handleChange("color", e.target.value)}
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Font Size (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.fontSize || "24"}
            onChange={(e) => handleChange("fontSize", e.target.value)}
            min="12"
            max="72"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Font Weight</label>
          <select
            className="form-select"
            value={element.config?.fontWeight || "600"}
            onChange={(e) => handleChange("fontWeight", e.target.value)}
          >
            <option value="400">Normal (400)</option>
            <option value="500">Medium (500)</option>
            <option value="600">Semi Bold (600)</option>
            <option value="700">Bold (700)</option>
            <option value="800">Extra Bold (800)</option>
          </select>
        </div>

        <WidthSettings config={element.config} onChange={handleChange} />
      </SettingsAccordion>

      {/* Spacing Settings */}
      <SettingsAccordion
        title="Spacing Settings"
        icon="fa-square-o text-primary"
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Top Margin (px)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.marginTop || "0"}
            onChange={(e) => handleChange("marginTop", e.target.value)}
            min="0"
          />
        </div>

        <div className="mb-1">
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

      {/* Divider Settings */}
      <SettingsAccordion title="Divider Settings" icon="fa-minus" eventKey="3">
        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showDivider"
              checked={element.config?.showDivider || false}
              onChange={(e) => handleChange("showDivider", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showDivider">
              Show Divider
            </label>
          </div>
        </div>

        {element.config?.showDivider && (
          <>
            <div className="mb-1">
              <label className="form-label">Divider Style</label>
              <select
                className="form-select"
                value={element.config?.dividerStyle || "solid"}
                onChange={(e) => handleChange("dividerStyle", e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
              </select>
            </div>

            <div className="mb-1">
              <label className="form-label">Divider Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.dividerColor || "#cccccc"}
                onChange={(e) => handleChange("dividerColor", e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label className="form-label">Divider Width (%)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.dividerWidth || "100"}
                onChange={(e) => handleChange("dividerWidth", e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <div className="mb-1">
              <label className="form-label">Divider Height (px)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.dividerHeight || "1"}
                onChange={(e) => handleChange("dividerHeight", e.target.value)}
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
        eventKey="4"
      >
        <div className="mb-1">
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

export default HeadingSettings;
