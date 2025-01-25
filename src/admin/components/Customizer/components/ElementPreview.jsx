import React from "react";
import "./ElementPreview.css";

const ElementPreview = ({ element, onUpdate }) => {
  if (!element || !element.config) {
    return <div>Loading...</div>;
  }

  const renderPreview = () => {
    switch (element.type) {
      case "text":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <input
              type={element.config.inputType || "text"}
              className={`form-control form-control-${
                element.config.size || "default"
              }`}
              placeholder={element.config.placeholder || "Enter text"}
              defaultValue={element.config.defaultValue || ""}
              readOnly={element.config.readOnly}
              style={{
                textTransform: element.config.textTransform || "none",
                width:
                  element.config.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config.width === "half"
                    ? "50%"
                    : "100%",
              }}
            />
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <textarea
              className="form-control"
              placeholder={element.config.placeholder || "Enter textarea"}
              defaultValue={element.config.defaultValue || ""}
              rows={element.config.rows || 3}
              readOnly={element.config.readOnly}
              style={{
                resize: element.config.resizable ? "both" : "none",
                width:
                  element.config.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config.width === "half"
                    ? "50%"
                    : "100%",
                height:
                  element.config.height === "custom"
                    ? `${element.config.customHeight}${
                        element.config.customHeightUnit || "px"
                      }`
                    : "auto",
              }}
            />
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "number":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <input
              type="number"
              className={`form-control form-control-${
                element.config.size || "default"
              }`}
              placeholder={element.config.placeholder || "Enter number"}
              defaultValue={element.config.defaultValue || ""}
              min={element.config.minValue}
              max={element.config.maxValue}
              step={element.config.step || 1}
              readOnly={element.config.readOnly}
              style={{
                width:
                  element.config.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config.width === "half"
                    ? "50%"
                    : "100%",
              }}
            />
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "email":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <input
              type="email"
              className={`form-control form-control-${
                element.config.size || "default"
              }`}
              placeholder={element.config.placeholder || "Enter email"}
              defaultValue={element.config.defaultValue || ""}
              readOnly={element.config.readOnly}
              autoComplete={element.config.autoComplete ? "on" : "off"}
              style={{
                width:
                  element.config.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config.width === "half"
                    ? "50%"
                    : "100%",
              }}
            />
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "phone":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <input
              type="tel"
              className={`form-control form-control-${
                element.config.size || "default"
              }`}
              placeholder={element.config.placeholder || "Enter phone number"}
              defaultValue={element.config.defaultValue || ""}
              readOnly={element.config.readOnly}
              style={{
                width:
                  element.config.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config.width === "half"
                    ? "50%"
                    : "100%",
              }}
            />
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "datetime":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <input
              type={
                element.config.displayMode === "time"
                  ? "time"
                  : element.config.displayMode === "date"
                  ? "date"
                  : "datetime-local"
              }
              className={`form-control form-control-${
                element.config.size || "default"
              }`}
              placeholder={element.config.placeholder || "Select date and time"}
              defaultValue={element.config.defaultValue || ""}
              min={element.config.minDate}
              max={element.config.maxDate}
              readOnly={element.config.readOnly}
              disabled={
                (element.config.disablePastDates &&
                  new Date() > new Date(element.config.minDate)) ||
                (element.config.disableFutureDates &&
                  new Date() < new Date(element.config.maxDate))
              }
              style={{
                width:
                  element.config.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config.width === "half"
                    ? "50%"
                    : "100%",
              }}
            />
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "file":
        return (
          <div className="form-group">
            {!element.config.hideLabel && element.config.label && (
              <label>{element.config.label}</label>
            )}
            <div className="custom-file">
              <input
                type="file"
                className={`form-control form-control-${
                  element.config.size || "default"
                }`}
                accept={element.config.allowedTypes?.join(",")}
                multiple={element.config.allowMultiple}
                disabled={element.config.readOnly}
                style={{
                  width:
                    element.config.width === "custom"
                      ? `${element.config.customWidth}${
                          element.config.customWidthUnit || "px"
                        }`
                      : element.config.width === "half"
                      ? "50%"
                      : "100%",
                }}
              />
              {element.config.maxFileSize && (
                <small className="d-block mt-1">
                  Max file size: {element.config.maxFileSize}MB
                </small>
              )}
              {element.config.allowedTypes && (
                <small className="d-block">
                  Allowed types: {element.config.allowedTypes.join(", ")}
                </small>
              )}
            </div>
            {element.config.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "select":
        return (
          <div className="form-group">
            {!element.config?.hideLabel && element.config?.label && (
              <label>{element.config.label}</label>
            )}
            <select
              className={`form-select form-select-${
                element.config?.size || "default"
              }`}
              multiple={element.config?.multiple}
              style={{
                width:
                  element.config?.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config?.width === "half"
                    ? "50%"
                    : "100%",
              }}
            >
              <option value="">
                {element.config?.placeholder || "Select an option"}
              </option>
              {element.config?.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}{" "}
                  {element.config?.showPrice && option.price
                    ? `($${option.price})`
                    : ""}
                </option>
              ))}
            </select>
            {element.config?.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="form-group">
            {!element.config?.hideLabel && element.config?.label && (
              <label>{element.config.label}</label>
            )}
            <select
              className={`form-select form-select-${
                element.config?.size || "default"
              }`}
              style={{
                width:
                  element.config?.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config?.width === "half"
                    ? "50%"
                    : "100%",
              }}
            >
              <option value="">
                {element.config?.placeholder || "Select an option"}
              </option>
              {element.config?.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}{" "}
                  {element.config?.showPrice && option.price
                    ? `($${option.price})`
                    : ""}
                </option>
              ))}
            </select>
            {element.config?.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "image-dropdown":
        return (
          <div className="form-group">
            {!element.config?.hideLabel && element.config?.label && (
              <label>{element.config.label}</label>
            )}
            <div
              className={`d-flex ${
                element.config?.layout === "grid" ? "flex-wrap" : "flex-column"
              }`}
              style={{
                gap: "10px",
                width:
                  element.config?.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config?.width === "half"
                    ? "50%"
                    : "100%",
              }}
            >
              {element.config?.options?.map((option, index) => (
                <div
                  key={index}
                  className="image-option"
                  style={{
                    flex: element.config?.layout === "grid" ? "0 0 auto" : "1",
                  }}
                >
                  {option.imageUrl && (
                    <img
                      src={option.imageUrl}
                      alt={option.label}
                      style={{
                        width: "100%",
                        maxWidth:
                          element.config?.imageSize === "small"
                            ? "100px"
                            : element.config?.imageSize === "large"
                            ? "300px"
                            : "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <div>
                    {option.label}{" "}
                    {element.config?.showPrice && option.price
                      ? `($${option.price})`
                      : ""}
                  </div>
                </div>
              ))}
            </div>
            {element.config?.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "radio":
        const handleRadioChange = (optionValue) => {
          if (onUpdate && typeof onUpdate === "function") {
            const updatedConfig = {
              ...element.config,
              defaultValue: optionValue,
            };
            onUpdate({ ...element, config: updatedConfig });
          }
        };

        return (
          <div className="form-group">
            {!element.config?.hideLabel && element.config?.label && (
              <label>{element.config.label}</label>
            )}
            {element.config?.helpText && (
              <small className="form-text text-muted d-block mb-2">
                {element.config.helpText}
              </small>
            )}
            <div
              className={`radio-options-wrapper layout-${
                element.config?.layout || "vertical"
              }`}
            >
              {(element.config?.options || []).map((option, idx) => (
                <div
                  key={idx}
                  className={`radio-option-item ${
                    element.config?.displayStyle || "standard"
                  }`}
                >
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name={`radio-${element.id}`}
                      id={`radio-${element.id}-${idx}`}
                      value={option.value}
                      checked={element.config?.defaultValue === option.value}
                      onChange={() => handleRadioChange(option.value)}
                    />
                    <div className="option-content">
                      {element.config?.showImage && option.image && (
                        <div
                          className={`option-image size-${
                            element.config?.imageSize || "medium"
                          }`}
                        >
                          <img src={option.image} alt={option.label} />
                        </div>
                      )}
                      <div className="option-text">
                        <label
                          className="form-check-label"
                          htmlFor={`radio-${element.id}-${idx}`}
                        >
                          {element.config?.showIcon && option.icon && (
                            <i className={`${option.icon} me-2`}></i>
                          )}
                          {option.label}
                        </label>
                        {element.config?.showDescription &&
                          option.description && (
                            <small className="description d-block text-muted">
                              {option.description}
                            </small>
                          )}
                        {element.config?.showPrice &&
                          option.price &&
                          option.price !== "0" && (
                            <span className="price-tag ms-2">
                              +${option.price}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="form-group">
            {!element.config?.hideLabel && element.config?.label && (
              <label>{element.config.label}</label>
            )}
            <div
              className={`d-flex ${
                element.config?.layout === "horizontal"
                  ? "flex-row"
                  : "flex-column"
              }`}
              style={{ gap: "10px" }}
            >
              {element.config?.options?.map((option, index) => (
                <div key={index} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value={option.value}
                  />
                  <label className="form-check-label">
                    {option.label}{" "}
                    {element.config?.showPrice && option.price
                      ? `($${option.price})`
                      : ""}
                  </label>
                </div>
              ))}
            </div>
            {element.config?.helpText && (
              <small className="form-text text-muted">
                {element.config.helpText}
              </small>
            )}
          </div>
        );

      case "button":
        return (
          <div className="form-group">
            <button
              type="button"
              className={`btn ${
                element.config?.buttonStyle === "outlined"
                  ? "btn-outline-primary"
                  : "btn-primary"
              } ${
                element.config?.buttonSize === "small"
                  ? "btn-sm"
                  : element.config?.buttonSize === "large"
                  ? "btn-lg"
                  : ""
              }`}
              style={{
                width:
                  element.config?.buttonWidth === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config?.buttonWidth === "full"
                    ? "100%"
                    : "auto",
                backgroundColor: element.config?.backgroundColor,
                color: element.config?.textColor,
                borderColor: element.config?.borderColor,
                borderRadius: `${element.config?.borderRadius || 4}px`,
                borderWidth: `${element.config?.borderWidth || 1}px`,
              }}
            >
              {element.config?.icon &&
                element.config?.iconPosition === "left" && (
                  <i className={`${element.config.icon} me-2`}></i>
                )}
              {element.config?.buttonText || "Button"}
              {element.config?.icon &&
                element.config?.iconPosition === "right" && (
                  <i className={`${element.config.icon} ms-2`}></i>
                )}
            </button>
          </div>
        );

      case "heading":
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
          <div className="form-group">
            <HeadingTag
              className={`preview-heading ${element.config?.customClass || ""}`}
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
                width:
                  element.config?.width === "custom"
                    ? `${element.config.customWidth}${
                        element.config.customWidthUnit || "px"
                      }`
                    : element.config?.width === "half"
                    ? "50%"
                    : "100%",
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
        return (
          <div
            className={element.config?.customClass || ""}
            style={{
              marginTop: `${element.config?.marginTop || "20"}px`,
              marginBottom: `${element.config?.marginBottom || "20"}px`,
              textAlign: element.config?.alignment || "center",
            }}
          >
            <div
              style={{
                borderTop: `${element.config?.height || "1"}px ${
                  element.config?.style || "solid"
                } ${element.config?.color || "#cccccc"}`,
                width: `${element.config?.width || "100"}${
                  element.config?.widthUnit || "%"
                }`,
                display: "inline-block",
                position: "relative",
              }}
            >
              {element.config?.hasIcon && (
                <i
                  className={element.config.icon}
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    left:
                      element.config.iconPosition === "left"
                        ? "0"
                        : element.config.iconPosition === "right"
                        ? "auto"
                        : "50%",
                    right:
                      element.config.iconPosition === "right" ? "0" : "auto",
                    fontSize: `${element.config.iconSize || "16"}px`,
                    color: element.config.iconColor || "#000000",
                  }}
                />
              )}
            </div>
          </div>
        );

      case "spacing":
        return (
          <div
            className={element.config?.customClass || ""}
            style={{
              height: `${element.config?.height || "20"}${
                element.config?.heightUnit || "px"
              }`,
              ...(element.config?.showBorder && {
                border: `${element.config?.borderWidth || "1"}px ${
                  element.config?.borderStyle || "solid"
                } ${element.config?.borderColor || "#eeeeee"}`,
              }),
            }}
          />
        );

      case "redirect":
        const linkStyle = element.config?.isButton
          ? {
              display: "inline-block",
              padding: "8px 16px",
              backgroundColor:
                element.config?.buttonStyle?.backgroundColor || "#0066cc",
              color: element.config?.buttonStyle?.textColor || "#ffffff",
              borderRadius: `${
                element.config?.buttonStyle?.borderRadius || "4"
              }px`,
              textDecoration: "none",
              border: `${
                element.config?.buttonStyle?.borderWidth || "1"
              }px solid ${
                element.config?.buttonStyle?.borderColor || "#0066cc"
              }`,
            }
          : {
              color: element.config?.color || "#0066cc",
              textDecoration: element.config?.textDecoration || "none",
            };

        return (
          <div
            className={element.config?.customClass || ""}
            style={{ textAlign: element.config?.alignment || "left" }}
          >
            <a
              href={element.config?.url || "#"}
              target={element.config?.target || "_self"}
              style={linkStyle}
            >
              {element.config?.icon &&
                element.config?.iconPosition === "left" && (
                  <i className={`${element.config.icon} me-2`} />
                )}
              {element.config?.label || "Click here"}
              {element.config?.icon &&
                element.config?.iconPosition === "right" && (
                  <i className={`${element.config.icon} ms-2`} />
                )}
            </a>
          </div>
        );

      default:
        return (
          <div className="text-muted">
            {element.type} preview will be implemented soon
          </div>
        );
    }
  };

  const getElementStyle = (element) => {
    return {
      width: element.config?.style?.width || "auto",
      ...element.config?.style,
    };
  };

  return <div className="element-preview mb-3">{renderPreview()}</div>;
};

export default ElementPreview;
