import React, { useState } from "react";
import "./ProductCustomizer.css";

const ProductCustomizer = ({ elements }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="product-page">
      <div className="container py-5">
        <div className="row">
          {/* Product Images Section */}
          <div className="col-md-6 mb-4">
            <div className="product-images">
              <div className="main-image mb-3">
                <img
                  src="https://placehold.co/600x400"
                  alt="Product"
                  className="img-fluid rounded"
                />
              </div>
              <div className="image-thumbnails d-flex gap-2">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={`https://placehold.co/100x100`}
                      alt={`Thumbnail ${index + 1}`}
                      className="img-fluid rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details & Customization Section */}
          <div className="col-md-6">
            <div className="product-details">
              <h1 className="product-title mb-3">Product Name</h1>
              <div className="product-price mb-4">
                <span className="current-price">$99.99</span>
                <span className="original-price text-muted text-decoration-line-through ms-2">
                  $129.99
                </span>
              </div>

              {/* Customization Form */}
              <div className="customization-form">
                <h5 className="mb-4">Customize Your Product</h5>

                {elements.map((element, index) => (
                  <div key={index} className="customization-field mb-4">
                    {/* Text Input */}
                    {element.type === "text" && (
                      <div className="form-group">
                        {!element.config.basic.hiddenLabel && (
                          <label className="form-label fw-medium">
                            {element.config.basic.label}
                            {element.config.basic.required && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        )}
                        <input
                          type="text"
                          className={`form-control form-control-${element.config.basic.size}`}
                          placeholder={element.config.basic.placeholder}
                        />
                        {element.config.basic.helpText && (
                          <small className="form-text text-muted">
                            {element.config.basic.helpText}
                          </small>
                        )}
                      </div>
                    )}

                    {/* Dropdown */}
                    {element.type === "dropdown" && (
                      <div className="form-group">
                        {!element.config.basic.hiddenLabel && (
                          <label className="form-label fw-medium">
                            {element.config.basic.label}
                            {element.config.basic.required && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        )}
                        <select
                          className={`form-select form-select-${element.config.basic.size}`}
                        >
                          <option value="">
                            Choose {element.config.basic.label}
                          </option>
                          {element.config.options?.map((option, i) => (
                            <option key={i} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {element.config.basic.helpText && (
                          <small className="form-text text-muted">
                            {element.config.basic.helpText}
                          </small>
                        )}
                      </div>
                    )}

                    {/* Radio Buttons */}
                    {element.type === "radio" && (
                      <div className="form-group">
                        {!element.config.basic.hiddenLabel && (
                          <label className="form-label fw-medium d-block">
                            {element.config.basic.label}
                            {element.config.basic.required && (
                              <span className="text-danger">*</span>
                            )}
                          </label>
                        )}
                        <div className="radio-group">
                          {element.config.options?.map((option, i) => (
                            <div key={i} className="form-check">
                              <input
                                type="radio"
                                className="form-check-input"
                                name={`radio-${element.id}`}
                                id={`radio-${element.id}-${i}`}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`radio-${element.id}-${i}`}
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        {element.config.basic.helpText && (
                          <small className="form-text text-muted">
                            {element.config.basic.helpText}
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Add to Cart Section */}
                <div className="add-to-cart-section mt-4">
                  <div className="quantity-selector mb-3">
                    <label className="form-label fw-medium">Quantity</label>
                    <select className="form-select w-auto">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary btn-lg w-100">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCustomizer;
