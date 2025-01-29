import React, { useState, useEffect } from "react";
import { Monitor, Smartphone } from "lucide-react";
import "./FrontendPreviewModal.css";
 
const FrontendPreviewModal = ({
  elements,
  onClose,
  embedded = false,
  defaultOpen = false,
}) => {
  const [viewMode, setViewMode] = useState("desktop");
  const [showOptions, setShowOptions] = useState(defaultOpen);
  const [activeOptionSet, setActiveOptionSet] = useState(null);
 
  // Get default value from first radio option if it exists
  const getDefaultOption = () => {
    const radioElement = elements.find((el) => el.type === "radio");
    if (radioElement?.config?.options?.length > 0) {
      return radioElement.config.options[0].label;
    }
    return "";
  };
 
  const [selectedOption, setSelectedOption] = useState(getDefaultOption());
 
  // Add this to handle escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);
 
  useEffect(() => {
    // Check if any element is marked as default open
    const defaultOpenElement = elements.find(
      (element) => element.isDefaultOpen
    );
 
    if (defaultOpenElement) {
      // Automatically set this as active
      setActiveOptionSet(defaultOpenElement.id);
    }
  }, [elements]);
 
  // Update showOptions when elements change
  useEffect(() => {
    const hasDefaultOpen = elements.some((element) => element.isDefaultOpen);
    setShowOptions(hasDefaultOpen);
  }, [elements]);
 
  // Update showOptions when defaultOpen changes
  useEffect(() => {
    setShowOptions(defaultOpen);
  }, [defaultOpen]);
 
  const renderElement = (element) => {
    if (!element || !element.config) {
      return null;
    }
 
    switch (element.type) {
      case "text":
        return (
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center justify-content-between w-50">
              <span className="fw-medium me-3">
                {element.config.label || ""}
              </span>
              <span className="text-danger">{selectedOption}</span>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="btn btn-sm btn-info text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        );
 
      case "textarea":
        return (
          <div className="w-100 mb-3">
            <label className="form-label">
              {element.config.label || "Comments"}
            </label>
            <textarea
              className="form-control"
              rows="3"
              placeholder={element.config.placeholder || "Enter your comments"}
            ></textarea>
          </div>
        );
 
      case "radio":
        if (!showOptions) return null;
        return (
          <div className="options-container mt-3 w-100">
            <div className="row d-flex g-2">
              {element.config.options?.map((opt, i) => (
                <div key={i} className="col-6">
                  <div
                    className={`card option-card ${
                      selectedOption === opt.label ? "border-primary" : ""
                    }`}
                    onClick={() => {
                      setSelectedOption(opt.label);
                      if (!defaultOpen) {
                        setShowOptions(false);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body text-center overflow-hidden p-0">
                      <img
                        src={
                          opt.image ||
                          `https://placehold.co/100x100?text=${opt.label}`
                        }
                        alt={opt.label}
                        className="mb-2"
                        style={{
                          maxWidth: "100px",
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      <div className="option-title">{opt.label}</div>
                      <div className="option-description text-muted small">
                        {opt.description || `${opt.label} Style`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
 
      case "button":
        return null;
 
      case "select":
        return (
          <div className="w-100 mb-3">
            <label className="form-label">
              {element.config.label || "Select"}
            </label>
            <select className="form-select">
              {element.config.options?.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );
 
      case "checkbox":
        return (
          <div className="w-100 mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`checkbox-${element.id}`}
              />
              <label
                className="form-check-label"
                htmlFor={`checkbox-${element.id}`}
              >
                {element.config.label || "Checkbox"}
              </label>
            </div>
          </div>
        );
 
      default:
        return null;
    }
  };
 
  // Check if we have the specific combination of elements
  const hasSpecificCombination = () => {
    const hasText = elements.some((el) => el.type === "text");
    const hasRadio = elements.some((el) => el.type === "radio");
    const hasButton = elements.some((el) => el.type === "button");
    return hasText && hasRadio && hasButton;
  };
 
  // Render specific combination preview
  const renderCombinationPreview = () => {
    return (
      <div className="preview-card">
        <div className="preview-card-header">
          <h5 className="customization-title">Product Customization</h5>
          <p className="customization-subtitle">
            Customize your product with the options below
          </p>
        </div>
        <div className="preview-card-body">
          {elements.map((element, index) => (
            <div key={element.id || index} className="preview-element">
              {renderElement(element)}
            </div>
          ))}
        </div>
      </div>
    );
  };
 
  // Render regular preview for individual elements
  const renderRegularPreview = () => {
    return (
      <div className="preview-card">
        <div className="preview-card-header">
          <h5 className="customization-title">CUSTOMISE</h5>
        </div>
        <div className="preview-card-body">
          <div className="row g-3">
            {elements.map((element, index) => (
              <React.Fragment key={element.id || index}>
                {renderRegularElement(element)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
 
  // Regular element rendering for individual elements
  const renderRegularElement = (element) => {
    // Get width style based on element config
    const getElementStyle = () => {
      if (element.config?.width === "custom" && element.config?.customWidth) {
        const width = element.config.customWidth;
        const unit = element.config.customWidthUnit || "px";
        return {
          width: `${width}${unit}`,
          flexBasis: `${width}${unit}`,
          maxWidth: `${width}${unit}`,
        };
      } else if (element.config?.width === "half") {
        return {
          width: "50%",
          flexBasis: "50%",
          maxWidth: "50%",
        };
      }
      return {
        width: "100%",
        flexBasis: "100%",
        maxWidth: "100%",
      };
    };
 
    const elementContent = () => {
      switch (element.type) {
        case "text":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Text"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="text"
                className="form-control"
                defaultValue={element.config.defaultValue}
              />
            </div>
          );
 
        case "textarea":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Textarea"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <textarea
                className="form-control"
                rows={3}
                defaultValue={element.config.defaultValue}
              />
            </div>
          );
 
        case "number":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Number"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="number"
                className="form-control"
                defaultValue={element.config.defaultValue}
              />
            </div>
          );
 
        case "phone":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Phone"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="tel"
                className="form-control"
                defaultValue={element.config.defaultValue}
              />
            </div>
          );
 
        case "email":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Email"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="email"
                className="form-control"
                defaultValue={element.config.defaultValue}
              />
            </div>
          );
 
        case "hidden":
          return null; // Hidden fields are not shown in preview
 
        case "datetime":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Date & Time"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input
                type="datetime-local"
                className="form-control"
                defaultValue={element.config.defaultValue}
              />
            </div>
          );
 
        case "file":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "File Upload"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <input type="file" className="form-control" />
            </div>
          );
 
        case "select":
        case "dropdown":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Select"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <select
                className="form-select"
                defaultValue={element.config.defaultValue}
              >
                {element.config.options?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
 
        case "image-dropdown":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Image Dropdown"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              <div className="image-dropdown-preview">
                {element.config.options?.map((option, index) => (
                  <div key={index} className="image-option">
                    <img
                      src={option.image}
                      alt={option.label}
                      className="img-thumbnail mb-2"
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </div>
          );
 
        case "radio":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Radio Button"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              {element.config.options?.map((option, index) => (
                <div className="form-check" key={index}>
                  <input
                    type="radio"
                    className="form-check-input"
                    name={`radio-${element.id}`}
                    id={`radio-${element.id}-${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`radio-${element.id}-${index}`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
 
        case "checkbox":
          return (
            <div className="form-group mb-3">
              <label className="form-label fw-bold">
                {element.config.label || "Checkbox"}
                {element.config.required && (
                  <span className="text-danger">*</span>
                )}
              </label>
              {element.config.options?.map((option, index) => (
                <div className="form-check" key={index}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`check-${element.id}-${index}`}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`check-${element.id}-${index}`}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
 
        case "button":
          return (
            <div className="form-group mb-3">
              <button className="btn btn-primary" disabled>
                {element.config.label || "Button"}
              </button>
            </div>
          );
 
        case "heading":
          console.log("Rendering heading with level:", element.config?.level);
 
          // Define default font sizes for different heading levels
          const headingSizes = {
            h1: "32",
            h2: "28",
            h3: "24",
            h4: "20",
            h5: "18",
            h6: "16",
          };
 
          const HeadingTag = element.config?.level || "h2";
          return (
            <div className="form-group mb-3">
              <HeadingTag
                className={`preview-heading ${
                  element.config?.customClass || ""
                }`}
                style={{
                  color: element.config?.color || "#000000",
                  fontSize: `${
                    element.config?.fontSize ||
                    headingSizes[element.config?.level] ||
                    "24"
                  }px`,
                  fontWeight: element.config?.fontWeight || "600",
                  textAlign: element.config?.alignment || "left",
                  marginTop: `${element.config?.marginTop || "0"}px`,
                  marginBottom: `${element.config?.marginBottom || "20"}px`,
                }}
              >
                {element.config?.text || "Heading"}
              </HeadingTag>
              {element.config?.showDivider && (
                <hr
                  style={{
                    borderStyle: element.config?.dividerStyle || "solid",
                    borderColor: element.config?.dividerColor || "#cccccc",
                    width: `${element.config?.dividerWidth || "100"}%`,
                    borderWidth: `${
                      element.config?.dividerHeight || "1"
                    }px 0 0 0`,
                  }}
                />
              )}
            </div>
          );
 
        case "divider":
          return <hr className="preview-divider my-4" />;
 
        case "spacing":
          return <div style={{ height: `${element.config.size || 20}px` }} />;
 
        default:
          return null;
      }
    };
 
    return (
      <div
        className={`form-element ${element.config?.width || "full"}-width`}
        style={getElementStyle()}
      >
        {elementContent()}
      </div>
    );
  };
 
  if (embedded) {
    return (
      <div className="preview-content">
        <div className="d-flex flex-column">
          {elements.map((element, index) => (
            <div key={index}>{renderElement(element)}</div>
          ))}
        </div>
      </div>
    );
  }
 
  return (
    <div className="frontend-preview-wrapper">
      <div className="frontend-preview-container">
        {/* Header */}
        <div className="preview-header">
          <button
            className="btn btn-light d-flex align-items-center gap-2"
            onClick={onClose}
          >
            <i className="fa fa-chevron-left"></i>
            <span>Back</span>
          </button>
 
          <h4 className="preview-title">Frontend Preview</h4>
 
          <div className="preview-controls">
            <button
              className={`view-btn ${viewMode === "desktop" ? "active" : ""}`}
              onClick={() => setViewMode("desktop")}
            >
              <Monitor size={20} />
              <span className="ms-2">Desktop</span>
            </button>
            <button
              className={`view-btn ${viewMode === "mobile" ? "active" : ""}`}
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone size={20} />
              <span className="ms-2">Mobile</span>
            </button>
          </div>
        </div>
 
        {/* Content */}
        <div className="preview-content-wrapper">
          <div
            className={`preview-container ${
              viewMode === "mobile" ? "mobile-view" : ""
            }`}
          >
            {hasSpecificCombination()
              ? renderCombinationPreview()
              : renderRegularPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default FrontendPreviewModal;