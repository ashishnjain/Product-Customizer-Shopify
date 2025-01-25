import React, { useEffect } from "react";
import { Accordion } from 'react-bootstrap';
import ValidationSettings from "./ValidationSettings";
import SettingsAccordion from "./SettingsAccordion";
import WidthSettings from './common/WidthSettings';
import "./TextSettings.css";

const DropdownSettings = ({ element, onUpdate }) => {
  console.log('DropdownSettings - element:', element);
  console.log('DropdownSettings - options:', element?.config?.options);
  
  useEffect(() => {
    const initialConfig = {
      ...element.config,
      options: element.config?.options || [
        { value: "option-1", label: "Option 1", price: "0", image: "" },
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
      price: "0",
      image: "",
    };
    handleChange("options", [...currentOptions, newOption]);
  };

  const removeOption = (index) => {
    const newOptions = element.config?.options?.filter((_, i) => i !== index) || [];
    handleChange("options", newOptions);
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
          <label className="form-label">Placeholder</label>
          <input
            type="text"
            className="form-control"
            value={element.config?.placeholder || ""}
            onChange={(e) => handleChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text"
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

      {/* Options Settings */}
      <SettingsAccordion 
        title="Options" 
        icon="fa-list text-secondary" 
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

            {element.config?.showPrice && (
              <div className="mb-2">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={option?.price || ""}
                  onChange={(e) =>
                    handleOptionChange(idx, "price", e.target.value)
                  }
                  placeholder="Additional price"
                  step="0.01"
                />
              </div>
            )}

            {element.config?.showImage && (
              <div className="mb-2">
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  className="form-control"
                  value={option?.image || ""}
                  onChange={(e) =>
                    handleOptionChange(idx, "image", e.target.value)
                  }
                  placeholder="Image URL"
                />
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
          className="btn btn-outline-primary btn-sm"
          onClick={addOption}
        >
          Add Option
        </button>
      </SettingsAccordion>

      {/* Display Settings */}
      <SettingsAccordion 
        title="Display Settings" 
        icon="fa-desktop text-primary" 
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Display Type</label>
          <select
            className="form-select"
            value={element.config?.displayType || "dropdown"}
            onChange={(e) => handleChange("displayType", e.target.value)}
          >
            <option value="dropdown">Dropdown</option>
            <option value="radio">Radio Buttons</option>
            <option value="buttons">Button Group</option>
            <option value="images">Image Swatch</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Option Layout</label>
          <select
            className="form-select"
            value={element.config?.optionLayout || "list"}
            onChange={(e) => handleChange("optionLayout", e.target.value)}
          >
            <option value="list">List</option>
            <option value="grid">Grid</option>
          </select>
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

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="showImage"
              checked={element.config?.showImage || false}
              onChange={(e) => handleChange("showImage", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showImage">
              Show Image
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Advanced Settings */}
      <SettingsAccordion 
        title="Advanced Settings" 
        icon="fa-sliders text-info" 
        eventKey="3"
      >
        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="multiple"
              checked={element.config?.multiple || false}
              onChange={(e) => handleChange("multiple", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="multiple">
              Allow Multiple Selections
            </label>
          </div>
        </div>

        {element.config?.multiple && (
          <div className="mb-1">
            <label className="form-label">Maximum Selections</label>
            <input
              type="number"
              className="form-control"
              value={element.config?.maxSelections || 1}
              onChange={(e) =>
                handleChange("maxSelections", Number(e.target.value))
              }
              min="1"
            />
          </div>
        )}

        <div className="mb-1">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="searchable"
              checked={element.config?.searchable || false}
              onChange={(e) => handleChange("searchable", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="searchable">
              Enable Search
            </label>
          </div>
        </div>
      </SettingsAccordion>

      {/* Validation Settings */}
      <SettingsAccordion 
        title="Validation Settings" 
        icon="fa-check-square-o text-danger" 
        eventKey="4"
      >
        <ValidationSettings
          config={element.config}
          elementType="dropdown"
          onChange={handleChange}
        />
      </SettingsAccordion>

      {/* Style Settings */}
      <SettingsAccordion 
        title="Style Settings" 
        icon="fa-paint-brush text-success" 
        eventKey="5"
      >
        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />
      </SettingsAccordion>
    </Accordion>
  );
};

export default DropdownSettings;
