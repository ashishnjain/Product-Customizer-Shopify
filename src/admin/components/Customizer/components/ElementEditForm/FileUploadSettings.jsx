import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const FileUploadSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "",
        placeholder: "Choose file",
        helpText: "",
        required: false,
        allowMultiple: false,
        maxFileSize: 10,
        minFileSize: 0,
        maxFiles: 1,
        allowedExtensions: [],
        maxResolution: "",
        minResolution: "",
        customValidationMessage: "",
        uploadLocation: "default",
        autoUpload: true,
        showPreview: true,
        showProgressBar: true,
        showFileList: true,
        buttonStyle: "default",
        width: "full",
        customWidth: "",
        customWidthUnit: "px"
      };
      onUpdate({ ...element, config: initialConfig });
    }
  }, []);

  const handleChange = (field, value) => {
    // Validate file size
    if (field === "maxFileSize") {
      const size = parseInt(value);
      if (isNaN(size) || size <= 0) {
        alert("Please enter a valid file size");
        return;
      }
    }

    // Validate file types
    if (field === "allowedTypes") {
      const types = value.split(",").map((type) => type.trim());
      const validTypes = types.every((type) => /^[.][a-zA-Z0-9]+$/.test(type));
      if (!validTypes) {
        alert("Please enter valid file extensions (e.g., .pdf, .jpg)");
        return;
      }
    }

    const updatedElement = {
      ...element,
      config: {
        ...element.config,
        [field]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const handleValidationChange = (field, value) => {
    handleChange(field, value);
  };

  const handleExtensionsChange = (e) => {
    const extensions = e.target.value
      .split(",")
      .map((ext) => ext.trim())
      .filter((ext) => ext)
      .map((ext) => (ext.startsWith(".") ? ext : `.${ext}`));
    handleChange("allowedExtensions", extensions);
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
          <label className="form-label">Label</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.label || ""}
            onChange={(e) => handleChange("label", e.target.value)}
            placeholder="Enter label"
          />
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="hideLabel"
              checked={element.config?.hideLabel || false}
              onChange={(e) => handleChange("hideLabel", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="hideLabel">
              Hide Label
            </label>
          </div>
        </div>

        <div className="mb-1">
          <label className="form-label">Button Text</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.buttonText || "Choose File"}
            onChange={(e) => handleChange("buttonText", e.target.value)}
            placeholder="Enter button text"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Help Text</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.helpText || ""}
            onChange={(e) => handleChange("helpText", e.target.value)}
            placeholder="Enter help text"
          />
        </div>
      </SettingsAccordion>

      {/* File Settings */}
      <SettingsAccordion 
        title="File Settings" 
        icon="fa-file-o text-secondary" 
        eventKey="1"
      >
        <div className="mb-1">
          <label className="form-label">Allowed File Types</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.allowedExtensions?.join(", ") || ""}
            onChange={handleExtensionsChange}
            placeholder="e.g., .jpg, .png, .pdf"
          />
          <small className="form-text text-muted">
            Enter file extensions separated by commas
          </small>
        </div>

        <div className="mb-1">
          <label className="form-label">Maximum File Size (MB)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.maxFileSize || ""}
            onChange={(e) =>
              handleChange("maxFileSize", Number(e.target.value))
            }
            min="0"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Minimum File Size (KB)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.minFileSize || ""}
            onChange={(e) =>
              handleChange("minFileSize", Number(e.target.value))
            }
            min="0"
          />
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="allowMultiple"
              checked={element.config?.allowMultiple || false}
              onChange={(e) => handleChange("allowMultiple", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="allowMultiple">
              Allow Multiple Files
            </label>
          </div>
        </div>

        {element.config?.allowMultiple && (
          <div className="mb-1">
            <label className="form-label">Maximum Number of Files</label>
            <input
              type="number"
              className="form-control"
              value={element.config?.maxFiles || ""}
              onChange={(e) => handleChange("maxFiles", Number(e.target.value))}
              min="1"
            />
          </div>
        )}
      </SettingsAccordion>

      {/* Image Settings */}
      <SettingsAccordion 
        title="Image Settings" 
        icon="fa-picture-o text-primary" 
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Maximum Resolution</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.maxResolution || ""}
            onChange={(e) => handleChange("maxResolution", e.target.value)}
            placeholder="e.g., 1920x1080"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Minimum Resolution</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.minResolution || ""}
            onChange={(e) => handleChange("minResolution", e.target.value)}
            placeholder="e.g., 800x600"
          />
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="compressImages"
              checked={element.config?.compressImages || false}
              onChange={(e) => handleChange("compressImages", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="compressImages">
              Compress Images
            </label>
          </div>
        </div>

        {element.config?.compressImages && (
          <div className="mb-1">
            <label className="form-label">Compression Quality (%)</label>
            <input
              type="number"
              className="form-control"
              value={element.config?.compressionQuality || 80}
              onChange={(e) =>
                handleChange("compressionQuality", Number(e.target.value))
              }
              min="1"
              max="100"
            />
          </div>
        )}
      </SettingsAccordion>

      {/* Display Settings */}
      <SettingsAccordion 
        title="Display Settings" 
        icon="fa-desktop text-info" 
        eventKey="3"
      >
        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPreview"
              checked={element.config?.showPreview || false}
              onChange={(e) => handleChange("showPreview", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showPreview">
              Show File Preview
            </label>
          </div>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showProgressBar"
              checked={element.config?.showProgressBar || false}
              onChange={(e) =>
                handleChange("showProgressBar", e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor="showProgressBar">
              Show Progress Bar
            </label>
          </div>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showFileList"
              checked={element.config?.showFileList || false}
              onChange={(e) => handleChange("showFileList", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showFileList">
              Show File List
            </label>
          </div>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="dragDrop"
              checked={element.config?.dragDrop || false}
              onChange={(e) => handleChange("dragDrop", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="dragDrop">
              Enable Drag & Drop
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Style Settings */}
      <SettingsAccordion 
        title="Style Settings" 
        icon="fa-paint-brush text-success" 
        eventKey="4"
      >
        <div className="mb-1">
          <label className="form-label">Button Style</label>
          <select
            className="form-select"
            value={element.config?.buttonStyle || "default"}
            onChange={(e) => handleChange("buttonStyle", e.target.value)}
          >
            <option value="default">Default</option>
            <option value="outline">Outline</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>

        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />
      </SettingsAccordion>
    </Accordion>
  );
};

export default FileUploadSettings;
