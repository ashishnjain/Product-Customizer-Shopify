import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import ValidationSettings from "./ValidationSettings";
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const ImageDropdownSettings = ({ element, onUpdate }) => {
  console.log('ImageDropdownSettings - element:', element);
  console.log('ImageDropdownSettings - options:', element?.config?.options);
  
  useEffect(() => {
    const initialConfig = {
      ...element.config,
      options: element.config?.options || [
        { value: "option-1", label: "Option 1", imageUrl: "", price: "0" },
      ],
      width: "full",
      customWidth: "",
      customWidthUnit: "px"
    };

    if (!element.config || !Array.isArray(element.config.options)) {
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

  const handleOptionChange = (index, field, value) => {
    const currentOptions = element.config?.options || [];
    const newOptions = [...currentOptions];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    handleChange("options", newOptions);
  };

  const addOption = () => {
    const currentOptions = element.config?.options || [];
    const newOption = {
      value: `option-${currentOptions.length + 1}`,
      label: `Option ${currentOptions.length + 1}`,
      imageUrl: "",
      price: "0",
    };
    handleChange("options", [...currentOptions, newOption]);
  };

  const removeOption = (index) => {
    const newOptions = element.config?.options?.filter((_, i) => i !== index) || [];
    handleChange("options", newOptions);
  };

  const handleImageChange = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleOptionChange(index, "imageUrl", e.target.result);
      };
      reader.readAsDataURL(file);
    }
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

      {/* Image Options */}
      <SettingsAccordion 
        title="Image Options" 
        icon="fa-picture-o text-primary" 
        eventKey="1"
      >
        {(element.config?.options || []).map((option, idx) => (
          <div key={idx} className="option-item mb-1 p-3 border rounded">
            <div className="mb-2">
              <label className="form-label">Option Label</label>
              <input
                type="text"
                className="form-control"
                value={option?.label || ""}
                onChange={(e) =>
                  handleOptionChange(idx, "label", e.target.value)
                }
                placeholder="Option label"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => handleImageChange(idx, e.target.files[0])}
              />
              {option.imageUrl && (
                <div className="mt-2">
                  <img
                    src={option.imageUrl}
                    alt={option.label}
                    style={{ maxWidth: "100px", height: "auto" }}
                  />
                </div>
              )}
            </div>

            {element.config?.showPrice && (
              <div className="mb-2">
                <label className="form-label">Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    value={option?.price || ""}
                    onChange={(e) =>
                      handleOptionChange(idx, "price", e.target.value)
                    }
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn btn-danger btn-sm mt-2"
              onClick={() => removeOption(idx)}
            >
              Delete Option
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary btn-sm mb-1"
          onClick={addOption}
        >
          Add Image Option
        </button>
      </SettingsAccordion>

      {/* Display Settings */}
      <SettingsAccordion 
        title="Display Settings" 
        icon="fa-desktop text-info" 
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Display Type</label>
          <select
            className="form-select"
            value={element.config?.displayType || "grid"}
            onChange={(e) => handleChange("displayType", e.target.value)}
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="slider">Slider</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Image Size</label>
          <select
            className="form-select"
            value={element.config?.imageSize || "medium"}
            onChange={(e) => handleChange("imageSize", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Columns (Grid View)</label>
          <input
            type="number"
            className="form-control"
            value={element.config?.columns || 3}
            onChange={(e) => handleChange("columns", Number(e.target.value))}
            min="1"
            max="6"
          />
        </div>

        <div className="mb-1">
          <label className="form-label">Aspect Ratio</label>
          <select
            className="form-select"
            value={element.config?.aspectRatio || "1:1"}
            onChange={(e) => handleChange("aspectRatio", e.target.value)}
          >
            <option value="1:1">1:1 (Square)</option>
            <option value="4:3">4:3</option>
            <option value="16:9">16:9</option>
            <option value="3:4">3:4</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showLabels"
              checked={element.config?.showLabels || false}
              onChange={(e) => handleChange("showLabels", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showLabels">
              Show Labels
            </label>
          </div>
        </div>

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPrice"
              checked={element.config?.showPrice || false}
              onChange={(e) => handleChange("showPrice", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showPrice">
              Show Price
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Validation Settings */}
      <SettingsAccordion 
        title="Validation Settings" 
        icon="fa-check-square-o text-danger" 
        eventKey="3"
      >
        <ValidationSettings
          config={element.config}
          elementType="imageDropdown"
          onChange={handleChange}
        />
      </SettingsAccordion>

      {/* Style Settings */}
      <SettingsAccordion 
        title="Style Settings" 
        icon="fa-paint-brush text-success" 
        eventKey="4"
      >
        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />
      </SettingsAccordion>
    </Accordion>
  );
};

export default ImageDropdownSettings;
