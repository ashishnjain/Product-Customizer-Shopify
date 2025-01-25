import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const RedirectLinkSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        basic: {
          url: "",
          label: "Click here",
          target: "_self",
          linkType: "url",
        },
        style: {
          isButton: false,
          color: "#0066cc",
          hoverColor: "#004499",
          fontSize: "16",
          fontWeight: "normal",
          textDecoration: "none",
          alignment: "left",
          width: "full",
          customWidth: "",
          customWidthUnit: "px",
          buttonStyle: {
            backgroundColor: "#0066cc",
            textColor: "#ffffff",
            borderColor: "#0066cc",
            borderWidth: "1",
            borderRadius: "4",
            hoverBackgroundColor: "#004499",
            hoverTextColor: "#ffffff",
            hoverBorderColor: "#004499",
          },
        },
        icon: {
          icon: "",
          iconPosition: "left",
          iconSize: "16",
          iconColor: "#0066cc",
        },
        advanced: {
          padding: "0",
          margin: "0",
          customClass: "",
        },
      };
      onUpdate({ ...element, config: initialConfig });
    }
  }, []);

  const handleBasicChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        basic: {
          ...element.config.basic,
          [field]: value,
        },
      },
    });
  };

  const handleStyleChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        style: {
          ...element.config.style,
          [field]: value,
        },
      },
    });
  };

  const handleButtonStyleChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        style: {
          ...element.config.style,
          buttonStyle: {
            ...element.config.style.buttonStyle,
            [field]: value,
          },
        },
      },
    });
  };

  const handleIconChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        icon: {
          ...element.config.icon,
          [field]: value,
        },
      },
    });
  };

  const handleAdvancedChange = (field, value) => {
    onUpdate({
      ...element,
      config: {
        ...element.config,
        advanced: {
          ...element.config.advanced,
          [field]: value,
        },
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
          <label className="form-label">Link Type</label>
          <select
            className="form-select"
            value={element.config?.basic?.linkType || "url"}
            onChange={(e) => handleBasicChange("linkType", e.target.value)}
          >
            <option value="url">URL</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="page">Page</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">URL/Email/Phone</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.basic?.url || ""}
            onChange={(e) => handleBasicChange("url", e.target.value)}
            placeholder={
              element.config?.basic?.linkType === "email"
                ? "Enter email address"
                : element.config?.basic?.linkType === "phone"
                ? "Enter phone number"
                : "Enter URL"
            }
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Link Text</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.basic?.label || ""}
            onChange={(e) => handleBasicChange("label", e.target.value)}
            placeholder="Enter link text"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Open In</label>
          <select
            className="form-select"
            value={element.config?.basic?.target || "_self"}
            onChange={(e) => handleBasicChange("target", e.target.value)}
          >
            <option value="_self">Same Window</option>
            <option value="_blank">New Window</option>
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
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="isButton"
              checked={element.config?.style?.isButton || false}
              onChange={(e) => handleStyleChange("isButton", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="isButton">
              Display as Button
            </label>
          </div>
        </div>

        <WidthSettings 
          config={element.config?.style} 
          onChange={(field, value) => handleStyleChange(field, value)}
        />

        {!element.config?.style?.isButton ? (
          <>
            {/* Link Style Options */}
            <div className="mb-1">
              <label className="form-label">Link Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.style?.color || "#0066cc"}
                onChange={(e) => handleStyleChange("color", e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label className="form-label">Hover Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.style?.hoverColor || "#004499"}
                onChange={(e) =>
                  handleStyleChange("hoverColor", e.target.value)
                }
              />
            </div>

            <div className="mb-1">
              <label className="form-label">Text Decoration</label>
              <select
                className="form-select"
                value={element.config?.style?.textDecoration || "none"}
                onChange={(e) =>
                  handleStyleChange("textDecoration", e.target.value)
                }
              >
                <option value="none">None</option>
                <option value="underline">Underline</option>
                <option value="overline">Overline</option>
                <option value="line-through">Line Through</option>
              </select>
            </div>
          </>
        ) : (
          <>
            {/* Button Style Options */}
            <div className="mb-1">
              <label className="form-label">Button Background</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.style?.buttonStyle?.backgroundColor || "#0066cc"}
                onChange={(e) => handleButtonStyleChange("backgroundColor", e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label className="form-label">Button Text Color</label>
              <input
                type="color"
                className="form-control form-control-color"
                value={element.config?.style?.buttonStyle?.textColor || "#ffffff"}
                onChange={(e) => handleButtonStyleChange("textColor", e.target.value)}
              />
            </div>

            <div className="mb-1">
              <label className="form-label">Border Radius (px)</label>
              <input
                type="number"
                className="form-control"
                value={element.config?.style?.buttonStyle?.borderRadius || "4"}
                onChange={(e) => handleButtonStyleChange("borderRadius", e.target.value)}
                min="0"
              />
            </div>
          </>
        )}

        <div className="mb-1">
          <label className="form-label">Alignment</label>
          <select
            className="form-select"
            value={element.config?.style?.alignment || "left"}
            onChange={(e) => handleStyleChange("alignment", e.target.value)}
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </SettingsAccordion>

      {/* Icon Settings */}
      <SettingsAccordion 
        title="Icon Settings" 
        icon="fa-ravelry text-primary" 
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Icon</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.icon?.icon || ""}
            onChange={(e) => handleIconChange("icon", e.target.value)}
            placeholder="Enter icon class"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Icon Position</label>
          <select
            className="form-select"
            value={element.config?.icon?.iconPosition || "left"}
            onChange={(e) => handleIconChange("iconPosition", e.target.value)}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </SettingsAccordion>

      {/* Advanced Settings */}
      <SettingsAccordion 
        title="Advanced Settings" 
        icon="fa-sliders text-info" 
        eventKey="3"
      >
        <div className="mb-1">
          <label className="form-label">Custom CSS Class</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.advanced?.customClass || ""}
            onChange={(e) => handleAdvancedChange("customClass", e.target.value)}
            placeholder="Enter custom CSS class"
          />
        </div>
      </SettingsAccordion>
    </Accordion>
  );
};

export default RedirectLinkSettings;
