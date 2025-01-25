import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import ValidationSettings from "./ValidationSettings";
import SettingsAccordion from "./SettingsAccordion";
import "./TextSettings.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import WidthSettings from './common/WidthSettings';

const RadioButtonSettings = ({ element, onUpdate }) => {
  useEffect(() => {
    if (!element.config) {
      const initialConfig = {
        label: "",
        options: [
          {
            value: "option-1",
            label: "Option 1",
            description: "",
            price: "0",
            image: "",
            icon: "",
          },
        ],
        helpText: "",
        required: false,
        defaultValue: "",
        layout: "vertical",
        displayStyle: "standard",
        showPrice: false,
        showDescription: true,
        showImage: true,
        showIcon: true,
        imageSize: "medium",
        optionSize: "medium",
        width: "full",
        customWidth: "",
        customWidthUnit: "px",
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

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...(element.config.options || [])];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
      value:
        field === "label" && !newOptions[index].value
          ? value.toLowerCase().replace(/\s+/g, "-")
          : newOptions[index].value,
    };
    handleChange("options", newOptions);
  };

  const addOption = () => {
    const currentOptions = element.config.options || [];
    const optionNumber = currentOptions.length + 1;
    const newOption = {
      value: `option-${optionNumber}`,
      label: `Option ${optionNumber}`,
      description: "",
      price: "0",
      image: "",
      icon: "",
    };
    handleChange("options", [...currentOptions, newOption]);
  };

  const deleteOption = (index) => {
    const newOptions = (element.config.options || []).filter(
      (_, idx) => idx !== index
    );
    handleChange("options", newOptions);
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      handleOptionChange(index, "image", imageUrl);

      const previewContainer = document.querySelector(
        `#image-preview-${index}`
      );
      if (previewContainer) {
        const previewImg = previewContainer.querySelector("img");
        if (previewImg) {
          previewImg.src = imageUrl;
        }
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(element.config.options);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    handleChange("options", items);
  };

  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (/defaultProps/.test(args[0])) return;
      originalError.call(console, ...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  const renderDraggableOptions = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="radio-options-list" type="radioOptions">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {(element.config?.options || []).map((option, idx) => (
              <Draggable
                key={`${option.value || idx}`}
                draggableId={`${option.value || `option-${idx}`}`}
                index={idx}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`option-item mb-1 p-3 border rounded row ${
                      snapshot.isDragging ? "shadow-lg border-primary" : ""
                    }`}
                  >
                    {/* Drag Handle */}
                    <div className="col-12 mb-2">
                      <div
                        {...provided.dragHandleProps}
                        className="d-flex align-items-center text-muted"
                        style={{ cursor: "move" }}
                      >
                        <i className="fa fa-bars me-2"></i>
                        <span>Option {idx + 1}</span>
                      </div>
                    </div>

                    {/* Option Label */}
                    <div className="mb-2 col-md-6 col-12">
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

                    {/* Description */}
                    <div className="mb-2 col-md-6 col-12">
                      <label className="form-label">Description</label>
                      <input
                        type="text"
                        className="form-control"
                        value={option?.description || ""}
                        onChange={(e) =>
                          handleOptionChange(idx, "description", e.target.value)
                        }
                        placeholder="Option description"
                      />
                    </div>

                    <div className="mb-2 col-md-6 col-12">
                      <label className="form-label">Image</label>
                      <div className="d-flex gap-2 align-items-start">
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control mb-2"
                            value={option?.image || ""}
                            onChange={(e) =>
                              handleOptionChange(idx, "image", e.target.value)
                            }
                            placeholder="Enter image URL"
                          />
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <input
                            type="file"
                            id={`file-upload-${idx}`}
                            className="d-none"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(idx, e.target.files[0])
                            }
                          />
                          <label
                            htmlFor={`file-upload-${idx}`}
                            className="btn btn-outline-primary btn-sm"
                            style={{
                              minWidth: "100px",
                              textAlign: "center",
                            }}
                          >
                            <i className="fa fa-upload me-1"></i>
                            Upload
                          </label>
                        </div>
                      </div>

                      <div
                        id={`image-preview-${idx}`}
                        className="image-preview mt-2"
                        style={{
                          border: option.image ? "1px solid #dee2e6" : "none",
                          borderRadius: "4px",
                          padding: option.image ? "4px" : "0",
                        }}
                      >
                        {option.image && (
                          <img
                            src={option.image}
                            alt={`Preview for ${option.label || "Option"}`}
                            style={{
                              maxWidth: "200px",
                              maxHeight: "150px",
                              objectFit: "contain",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="mb-2 col-md-6 col-12">
                      <label className="form-label">Icon</label>
                      <input
                        type="text"
                        className="form-control"
                        value={option?.icon || ""}
                        onChange={(e) =>
                          handleOptionChange(idx, "icon", e.target.value)
                        }
                        placeholder="Enter icon class"
                      />
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
                          />
                        </div>
                      </div>
                    )}

                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteOption(idx)}
                      >
                        Remove Option
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

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

      {/* Radio Options */}
      <SettingsAccordion
        title="Radio Options"
        icon="fa-list-ul text-primary"
        eventKey="1"
      >
        {renderDraggableOptions()}

        <button
          type="button"
          className="btn btn-primary btn-sm mt-3"
          onClick={addOption}
        >
          Add Option
        </button>
      </SettingsAccordion>

      {/* Display Settings */}
      <SettingsAccordion
        title="Display Settings"
        icon="fa-desktop text-info"
        eventKey="2"
      >
        <div className="mb-1">
          <label className="form-label">Layout</label>
          <select
            className="form-select"
            value={element.config?.layout || "vertical"}
            onChange={(e) => handleChange("layout", e.target.value)}
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
            <option value="grid">Grid</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Display Style</label>
          <select
            className="form-select"
            value={element.config?.displayStyle || "standard"}
            onChange={(e) => handleChange("displayStyle", e.target.value)}
          >
            <option value="standard">Standard Radio</option>
            <option value="button">Button Style</option>
            <option value="card">Card Style</option>
          </select>
        </div>

        <div className="mb-1">
          <label className="form-label">Option Size</label>
          <select
            className="form-select"
            value={element.config?.optionSize || "medium"}
            onChange={(e) => handleChange("optionSize", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <WidthSettings 
          config={element.config} 
          onChange={handleChange}
        />

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
          elementType="radio"
          onChange={handleChange}
        />
      </SettingsAccordion>
    </Accordion>
  );
};

export default RadioButtonSettings;
