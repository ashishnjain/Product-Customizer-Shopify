import React, { useState, useEffect } from "react";
import NewOptionSetScreen from "./NewOptionSetScreen";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FrontendPreviewModal from "../../../../frontend/pages/products/FrontendPreviewModal";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const DashboardScreen = ({ onCreateOptionSet }) => {
  const [activeTab, setActiveTab] = useState("optionSets");
  const [editingOptionSet, setEditingOptionSet] = useState(null);
  const [selectedOptionSets, setSelectedOptionSets] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [editingOption, setEditingOption] = useState(null);
  const [showNewOption, setShowNewOption] = useState(false);
  const [selectedOptionSet, setSelectedOptionSet] = useState(null);
  const [showFrontendPreview, setShowFrontendPreview] = useState(false);
  const [previewingOptionSet, setPreviewingOptionSet] = useState(null);
  const [expandedOptionSet, setExpandedOptionSet] = useState(null);

  // Get saved option sets and templates from localStorage
  const [optionSets, setOptionSets] = useState(() => {
    try {
      const savedOptionSets = localStorage.getItem("optionSets");
      const parsed = savedOptionSets ? JSON.parse(savedOptionSets) : [];
      return parsed.map((set) => ({
        id: set?.id || Date.now(),
        name: set?.name || "Untitled Option Set",
        elements: set?.elements || [],
        isDefaultOpen: set?.isDefaultOpen || false,
        createdAt: set?.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.error("Error loading option sets:", e);
      return [];
    }
  });

  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem("templates");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    try {
      const savedOptions = JSON.parse(
        localStorage.getItem("optionSets") || "[]"
      );
      const validatedOptions = savedOptions.map((set) => ({
        id: set?.id || Date.now(),
        name: set?.name || "Untitled Option Set",
        elements: set?.elements || [],
        createdAt: set?.createdAt || new Date().toISOString(),
      }));
      setOptionSets(validatedOptions);
    } catch (e) {
      console.error("Error loading option sets in useEffect:", e);
      setOptionSets([]);
    }
  }, []);

  const handleEditOptionSet = (optionSet) => {
    setEditingOptionSet(optionSet);
  };

  const handleDeleteOptionSet = (id) => {
    if (window.confirm("Are you sure you want to delete this option set?")) {
      // Remove from options list
      const updatedOptionSets = optionSets.filter((set) => set.id !== id);
      localStorage.setItem("optionSets", JSON.stringify(updatedOptionSets));
      setOptionSets(updatedOptionSets);

      // Remove from templates/option sets
      const updatedTemplates = templates.map((template) => ({
        ...template,
        optionSets: template.optionSets.filter((set) => set.id !== id),
      }));

      localStorage.setItem("templates", JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);

      // Show success message
      toast.error("Option deleted successfully from all locations!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleSaveOptionSet = (savedOptionSet) => {
    try {
      // Check if the option set has any elements
      if (!savedOptionSet.elements || savedOptionSet.elements.length === 0) {
        toast.error(
          "Cannot save empty option set. Please add at least one element.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        return; // Exit the function without saving
      }

      const updatedOptionSets = editingOptionSet
        ? optionSets.map((set) =>
            set.id === savedOptionSet.id
              ? {
                  ...savedOptionSet,
                  isDefaultOpen: set.isDefaultOpen,
                  elements: savedOptionSet.elements.map((element) => ({
                    ...element,
                    config: {
                      ...element.config,
                      options: element.config?.options
                        ? element.config.options.map((opt) => ({ ...opt }))
                        : [],
                    },
                  })),
                }
              : set
          )
        : [...optionSets, { ...savedOptionSet, isDefaultOpen: false }];

      localStorage.setItem("optionSets", JSON.stringify(updatedOptionSets));
      setOptionSets(updatedOptionSets);
      setEditingOptionSet(null);
      setShowNewOption(false);

      // Update any templates that use this option set
      const updatedTemplates = templates.map((template) => ({
        ...template,
        optionSets: template.optionSets.map((set) =>
          set.id === savedOptionSet.id ? savedOptionSet : set
        ),
      }));

      localStorage.setItem("templates", JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);

      toast.success(
        editingOptionSet
          ? "Option updated successfully!"
          : "Option saved successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error("Error saving option:", error);
      toast.error("Failed to save option");
    }
  };

  const handleEditTemplate = (template) => {
    if (!template) return;

    setEditingTemplate(template);
    setSelectedOptionSets(template?.optionSets?.map((set) => set?.id) || []);
    setActiveTab("optionSets");
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter((t) => t.id !== templateId);
      localStorage.setItem("templates", JSON.stringify(updatedTemplates));
      setTemplates(updatedTemplates);
    }
  };

  const handleSaveTemplate = () => {
    if (selectedOptionSets.length === 0) {
      alert("Please select at least one option set");
      return;
    }

    const templateName = editingTemplate
      ? editingTemplate.name
      : prompt("Enter template name:");

    if (!templateName) return;

    const newTemplate = {
      id: editingTemplate?.id || Date.now(),
      name: templateName,
      optionSets: selectedOptionSets.map((id) =>
        optionSets.find((set) => set.id === id)
      ),
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTemplates = editingTemplate
      ? templates.map((t) => (t.id === editingTemplate.id ? newTemplate : t))
      : [...templates, newTemplate];

    localStorage.setItem("templates", JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
    setSelectedOptionSets([]);
    setEditingTemplate(null);
  };

  const handleEdit = (optionSet) => {
    setEditingOptionSet(optionSet);
    setEditingOption(optionSet);
  };

  const handleViewOptionSet = (optionSet) => {
    if (optionSet) {
      setSelectedOptionSet(optionSet);
    }
  };

  const handleChange = (field, value) => {
    if (!element || !element.config) return;

    const updatedElement = {
      ...element,
      config: {
        ...element.config,
        [field]: value,
      },
    };
    onUpdate(updatedElement);
  };

  const hasExactRequiredElements = (elements) => {
    const requiredTypes = ["text", "radio", "button"];
    const elementTypes = elements?.map((elem) => elem.type) || [];

    // Check if array has exactly these three elements (no more, no less)
    return (
      elementTypes.length === 3 &&
      requiredTypes.every((type) => elementTypes.includes(type)) &&
      elementTypes.every((type) => requiredTypes.includes(type))
    );
  };

  const handlePreviewOptionSet = (template) => {
    // Find the original optionSets with their current isDefaultOpen states
    const optionsWithDefaultOpen = template.optionSets.map((templateSet) => {
      // Find the matching original optionSet to get its current isDefaultOpen state
      const originalSet = optionSets.find((set) => set.id === templateSet.id);

      return {
        ...templateSet,
        isDefaultOpen: originalSet ? originalSet.isDefaultOpen : false,
        elements: templateSet.elements.map((element) => ({
          ...element,
          isDefaultOpen: originalSet ? originalSet.isDefaultOpen : false,
        })),
      };
    });

    setPreviewingOptionSet({
      ...template,
      optionSets: optionsWithDefaultOpen,
    });
    setShowFrontendPreview(true);
  };

  const handleDuplicateOption = (optionSet) => {
    // Create a deep copy of the option set with all its properties
    const duplicatedOption = {
      ...JSON.parse(JSON.stringify(optionSet)), // Deep clone to ensure all nested objects are copied
      id: Date.now(),
      name: `${optionSet.name} (Copy)`,
      createdAt: new Date().toISOString(),
      elements: optionSet.elements.map((element) => ({
        ...element,
        id: Date.now() + Math.random(), // Ensure unique IDs for elements
        config: {
          ...element.config,
          // Deep clone any nested configurations
          options: element.config?.options
            ? element.config.options.map((opt) => ({ ...opt }))
            : [],
        },
      })),
    };

    const updatedOptionSets = [...optionSets, duplicatedOption];
    localStorage.setItem("optionSets", JSON.stringify(updatedOptionSets));
    setOptionSets(updatedOptionSets);

    toast.warning("Option duplicated successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleToggleDefaultOpen = (optionSet) => {
    const updatedSets = optionSets.map((set) => ({
      ...set,
      isDefaultOpen: set.id === optionSet.id ? !set.isDefaultOpen : false,
    }));

    localStorage.setItem("optionSets", JSON.stringify(updatedSets));
    setOptionSets(updatedSets);

    toast.info(
      `${optionSet.name} will ${
        !optionSet.isDefaultOpen ? "now" : "no longer"
      } open by default`,
      {
        position: "top-right",
        autoClose: 3000,
      }
    );
  };

  const renderEmptyState = () => {
    return (
      <div className="empty-state-container text-center py-2">
        {/* App Logo/Name Section */}
        <div className="app-branding mb-3">
          <h1 className="app-name text-primary mb-2">
            <i className="fa fa-cube me-2"></i>
            Product Customizer
          </h1>
          <p className="text-muted">
            Your complete product customization solution
          </p>
        </div>

        {/* Welcome Section */}
        <div className="welcome-content">
          <div className="mb-3">
            <i className="fa fa-magic fs-1"></i>
          </div>

          <h2 className="welcome-title mb-3">Let's Get Started!</h2>

          <p className="text-muted mb-3 welcome-description">
            Create customizable options for your products.
            <br />
            Add features like color selection, size options, text inputs and
            more
            <br />
            to enhance your product offerings.
          </p>

          <button
            className="btn btn-success btn-lg get-started-btn"
            onClick={() => setShowNewOption(true)}
          >
            <i className="fa fa-plus-circle me-2"></i>
            Create Your First Option
          </button>
        </div>

        {/* Features Section */}
        <div className="features-section mt-3 pt-4">
          <div className="row g-4 justify-content-center">
            <div className="col-md-4 mt-0">
              <div className="feature-item">
                <i className="fa fa-paint-brush text-primary fs-2 mb-3"></i>
                <h5>Customization Options</h5>
                <p className="text-muted small">
                  Create various customization options like colors, sizes, and
                  more
                </p>
              </div>
            </div>
            <div className="col-md-4 mt-0">
              <div className="feature-item">
                <i className="fa fa-object-group text-success fs-2 mb-3"></i>
                <h5>Option Sets</h5>
                <p className="text-muted small">
                  Group related options together for better organization
                </p>
              </div>
            </div>
            <div className="col-md-4 mt-0">
              <div className="feature-item">
                <i className="fa fa-mobile text-info fs-2 mb-3"></i>
                <h5>Responsive Design</h5>
                <p className="text-muted small">
                  Works perfectly on all devices and screen sizes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(optionSets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOptionSets(items);
    localStorage.setItem("optionSets", JSON.stringify(items));
  };

  // If editing an option set, show the NewOptionSetScreen
  if (editingOptionSet || showNewOption || selectedOptionSet) {
    return (
      <NewOptionSetScreen
        editingOptionSet={editingOptionSet}
        onBack={() => {
          setEditingOptionSet(null);
          setShowNewOption(false);
          setSelectedOptionSet(null);
          setEditingOption(null);
        }}
        editingOption={editingOption || selectedOptionSet}
        onSave={handleSaveOptionSet}
        isEditing={!!editingOptionSet} // Pass this prop to indicate edit mode
      />
    );
  }

  return (
    <ErrorBoundary>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container-fluid p-md-3">
        {/* Header - Show only if options exist */}
        {optionSets.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">
              {editingTemplate
                ? `Edit Option Set: ${editingTemplate.name}`
                : "Customization Dashboard"}
            </h4>
            <div className="d-flex gap-2">
              {activeTab === "optionSets" && selectedOptionSets.length > 0 && (
                <button
                  className="btn btn-warning"
                  onClick={handleSaveTemplate}
                >
                  {editingTemplate ? "Update Option Set" : "Save as Option Set"}{" "}
                  ({selectedOptionSets.length})
                </button>
              )}
              <button
                className="btn btn-success"
                onClick={() => setShowNewOption(true)}
              >
                Create Option
              </button>
            </div>
          </div>
        )}

        {/* Show empty state if no options exist */}
        {optionSets.length === 0 ? (
          <div className="card mb-0 pb-0">
            <div className="card-body p-0">{renderEmptyState()}</div>
          </div>
        ) : (
          /* Existing dashboard UI */
          <div className="card ">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item fs-5">
                  <button
                    className={`nav-link ${
                      activeTab === "optionSets" ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveTab("optionSets");
                      if (!editingTemplate) {
                        setSelectedOptionSets([]);
                      }
                    }}
                  >
                    <i className="fa fa-cogs text-info" aria-hidden="true">
                      &nbsp;&nbsp;
                    </i>
                    Options
                  </button>
                </li>
                <li className="nav-item fs-5">
                  <button
                    className={`nav-link ${
                      activeTab === "templates" ? "active" : ""
                    }`}
                    onClick={() => {
                      if (editingTemplate) {
                        if (window.confirm("Discard option set changes?")) {
                          setEditingTemplate(null);
                          setSelectedOptionSets([]);
                          setActiveTab("templates");
                        }
                      } else {
                        setActiveTab("templates");
                      }
                    }}
                  >
                    <i
                      className="fa fa-file-text text-primary"
                      aria-hidden="true"
                    >
                      &nbsp;&nbsp;
                    </i>
                    Option Sets
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body">
              {activeTab === "optionSets" && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="optionsList">
                    {(provided) => (
                      <div
                        className="row g-4"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {(optionSets || []).map((optionSet, index) => {
                          if (!optionSet) return null;

                          return (
                            <Draggable
                              key={optionSet.id}
                              draggableId={optionSet.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="col-lg-4 col-md-6 col-sm-12"
                                >
                                  <div
                                    className={`card h-100 ${
                                      selectedOptionSets.includes(optionSet?.id)
                                        ? "border-primary"
                                        : ""
                                    } ${
                                      snapshot.isDragging ? "shadow-lg" : ""
                                    }`}
                                  >
                                    <div className="card-body">
                                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
                                        <div className="d-flex gap-2 align-items-start">
                                          <div
                                            {...provided.dragHandleProps}
                                            className="drag-handle me-2 text-muted"
                                          >
                                            <i className="fa fa-bars"></i>
                                          </div>

                                          <input
                                            type="checkbox"
                                            className="form-check-input mt-1 border-dark"
                                            checked={selectedOptionSets.includes(
                                              optionSet?.id
                                            )}
                                            onChange={(e) => {
                                              setSelectedOptionSets((prev) => {
                                                if (e.target.checked) {
                                                  return [
                                                    ...prev,
                                                    optionSet?.id,
                                                  ];
                                                } else {
                                                  return prev.filter(
                                                    (id) => id !== optionSet?.id
                                                  );
                                                }
                                              });
                                            }}
                                          />
                                          <div>
                                            <h5 className="mb-1">
                                              {optionSet?.name || "Untitled"}
                                            </h5>
                                            <div className="text-muted small">
                                              {optionSet?.elements?.length || 0}{" "}
                                              elements • Created{" "}
                                              {new Date(
                                                optionSet?.createdAt ||
                                                  Date.now()
                                              ).toLocaleDateString()}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                          <button
                                            className="btn btn-link p-0"
                                            onClick={() =>
                                              handleToggleDefaultOpen(optionSet)
                                            }
                                            title={
                                              optionSet.isDefaultOpen
                                                ? "Currently set to open by default"
                                                : "Click to set as default open"
                                            }
                                          >
                                            <i
                                              className={`fa fa-eye${
                                                optionSet.isDefaultOpen
                                                  ? ""
                                                  : "-slash"
                                              } ${
                                                optionSet.isDefaultOpen
                                                  ? "text-success"
                                                  : "text-muted"
                                              } fs-5`}
                                              aria-hidden="true"
                                            ></i>
                                          </button>
                                          <button
                                            className="btn btn-link p-0"
                                            onClick={() =>
                                              handleEdit(optionSet)
                                            }
                                            title="Edit option"
                                          >
                                            <i
                                              className="fa fa-pencil-square-o text-warning fs-5"
                                              aria-hidden="true"
                                            ></i>
                                          </button>
                                          <button
                                            className="btn btn-link p-0"
                                            onClick={() =>
                                              handleDuplicateOption(optionSet)
                                            }
                                            title="Duplicate option"
                                          >
                                            <i
                                              className="fa fa-copy text-primary fs-5"
                                              aria-hidden="true"
                                            ></i>
                                          </button>
                                          <button
                                            className="btn btn-link p-0"
                                            onClick={() =>
                                              handleDeleteOptionSet(
                                                optionSet.id
                                              )
                                            }
                                            title="Delete option"
                                          >
                                            <i
                                              className="fa fa-trash text-danger fs-5"
                                              aria-hidden="true"
                                            ></i>
                                          </button>
                                        </div>
                                      </div>

                                      {/* Preview Section */}
                                      <div className="preview-section h-0 p-0 mb-3">
                                        <h6 className="mb-2">Preview</h6>
                                        <div className="preview-container p-0">
                                          {hasExactRequiredElements(
                                            optionSet.elements
                                          ) ? (
                                            <FrontendPreviewModal
                                              key={`${optionSet.id}-${optionSet.isDefaultOpen}`}
                                              elements={optionSet.elements}
                                              onClose={() => {}}
                                              embedded={true}
                                              defaultOpen={
                                                optionSet.isDefaultOpen
                                              }
                                            />
                                          ) : (
                                            <div className="normal-preview p-3">
                                              <h5>{optionSet.name}</h5>
                                              {optionSet.isDefaultOpen && (
                                                <div className="preview-options d-flex gap-3">
                                                  {optionSet.elements
                                                    ?.find(
                                                      (el) =>
                                                        el.type === "radio"
                                                    )
                                                    ?.config?.options?.map(
                                                      (option, idx) => (
                                                        <div
                                                          key={idx}
                                                          className="option-card"
                                                        >
                                                          <div
                                                            className="preview-image bg-light"
                                                            style={{
                                                              width: "100px",
                                                              height: "100px",
                                                            }}
                                                          >
                                                            <img
                                                              src={
                                                                option.image ||
                                                                `https://placehold.co/100x100?text=Preview`
                                                              }
                                                              alt={option.label}
                                                              className="w-100 h-100 object-fit-cover"
                                                            />
                                                          </div>
                                                          <h6 className="mt-2 mb-1">
                                                            {option.label ||
                                                              "Option"}
                                                          </h6>
                                                          <p className="small text-muted mb-0">
                                                            {option.description ||
                                                              "lorem ipsum lorem ipsum"}
                                                          </p>
                                                        </div>
                                                      )
                                                    )}
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}

              {activeTab === "templates" && (
                <div className="row g-4">
                  {(templates || []).map((template) => (
                    <div key={template.id} className="col-md-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <h5 className="mb-0">{template.name}</h5>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-link p-0"
                                onClick={() => handlePreviewOptionSet(template)}
                                title="Preview option set"
                              >
                                <i
                                  className="fa fa-eye text-info fs-5"
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                className="btn btn-link p-0"
                                onClick={() => handleEditTemplate(template)}
                                title="Edit option set"
                              >
                                <i
                                  className="fa fa-pencil-square-o text-warning fs-5"
                                  aria-hidden="true"
                                ></i>
                              </button>
                              <button
                                className="btn btn-link p-0"
                                onClick={() =>
                                  handleDeleteTemplate(template.id)
                                }
                                title="Delete option set"
                              >
                                <i
                                  className="fa fa-trash text-danger fs-5"
                                  aria-hidden="true"
                                ></i>
                              </button>
                            </div>
                          </div>
                          <div className="text-muted small mb-3">
                            Created{" "}
                            {new Date(template.createdAt).toLocaleDateString()}
                            {template.updatedAt &&
                              template.updatedAt !== template.createdAt &&
                              ` • Updated ${new Date(
                                template.updatedAt
                              ).toLocaleDateString()}`}
                          </div>
                          <div>
                            <h6 className="mb-2">
                              Option Sets ({template.optionSets.length})
                            </h6>
                            <div className="fields-list">
                              {(template.optionSets || []).map((set, index) => (
                                <div key={index} className="field-item small">
                                  {set.name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showFrontendPreview && previewingOptionSet && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-dialog modal-xl"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "auto",
              maxWidth: "1200px",
              margin: 0,
              backgroundColor: "white",
              borderRadius: "8px",
              zIndex: 1051,
            }}
          >
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center border-bottom shadow-sm pb-3">
                <h5 className="modal-title">
                  {previewingOptionSet.name} - Preview
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowFrontendPreview(false);
                    setPreviewingOptionSet(null);
                  }}
                ></button>
              </div>
              <div className="modal-body pt-3">
                <div className="row g-2">
                  {previewingOptionSet.optionSets.map((optionSet, index) => (
                    <div key={index} className="col-12 mb-4">
                      <FrontendPreviewModal
                        key={`${optionSet.id}-${optionSet.isDefaultOpen}`}
                        elements={optionSet.elements}
                        onClose={() => {}}
                        embedded={true}
                        defaultOpen={optionSet.isDefaultOpen}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default DashboardScreen;
