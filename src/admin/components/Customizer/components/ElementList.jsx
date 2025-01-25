import React from 'react';

const ElementList = ({ elements, onAddElement, onEditElement, onDeleteElement }) => {
  const handleAddElement = (type) => {
    const newElement = {
      id: Date.now().toString(), // Simple ID generation
      type: type,
      config: {
        label: '',
        placeholder: type === 'file' ? 'Choose file' : '',
        required: false,
      }
    };
    onAddElement(newElement);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6>Elements</h6>
        <button 
          className="btn btn-primary" 
          onClick={() => document.getElementById('addElementMenu').classList.toggle('show')}
        >
          Add Element
        </button>
      </div>

      <div id="addElementMenu" className="mb-3" style={{ display: 'none' }}>
        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('text')}
        >
          <i className="bi bi-input-cursor-text me-2"></i>
          New text
        </button>

        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('textarea')}
        >
          <i className="bi bi-textarea-t me-2"></i>
          New textarea
        </button>

        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('number')}
        >
          <i className="bi bi-123 me-2"></i>
          New number
        </button>

        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('email')}
        >
          <i className="bi bi-envelope me-2"></i>
          New email
        </button>

        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('phone')}
        >
          <i className="bi bi-telephone me-2"></i>
          New phone
        </button>

        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('datetime')}
        >
          <i className="bi bi-calendar me-2"></i>
          New datetime
        </button>

        <button 
          className="btn btn-outline-secondary mb-2 w-100 text-start"
          onClick={() => handleAddElement('file')}
        >
          <i className="bi bi-file-earmark-arrow-up me-2"></i>
          New file
        </button>
      </div>

      {elements.map((element) => (
        <div key={element.id} className="d-flex align-items-center mb-2 p-2 border rounded">
          <div className="flex-grow-1">
            {element.config?.label || `New ${element.type}`}
          </div>
          <div>
            <button
              className="btn btn-sm btn-link text-primary me-2"
              onClick={() => onEditElement(element)}
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-sm btn-link text-danger"
              onClick={() => onDeleteElement(element.id)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ElementList; 