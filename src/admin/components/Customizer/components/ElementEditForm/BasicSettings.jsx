import React from 'react';

export const BasicSettings = ({ config, onChange }) => {
  if (!config) return <div>No configuration available</div>;

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...(config.styles || [])];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onChange('styles', newOptions);
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleOptionChange(index, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addStyle = () => {
    onChange('styles', [...(config.styles || []), { 
      name: '', 
      description: '',
      image: '',
      isDefault: false 
    }]);
  };

  const removeStyle = (index) => {
    const newOptions = [...(config.styles || [])];
    newOptions.splice(index, 1);
    onChange('styles', newOptions);
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Pocket Name</label>
        <input
          type="text"
          className="form-control"
          value={config.label || ''}
          onChange={(e) => onChange('label', e.target.value)}
          placeholder="e.g., Front Pocket Style"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Styles</label>
        {(config.styles || []).map((style, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <div className="d-flex gap-2 mb-2">
              <input
                type="text"
                className="form-control"
                value={style.name}
                onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                placeholder="Style name (e.g., Classic)"
              />
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeStyle(index)}
              >
                Remove
              </button>
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                value={style.description || ''}
                onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                placeholder="Style description"
              />
            </div>
            <div className="mb-2">
              <label className="form-label small">Style Image</label>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="file"
                  className="form-control form-control-sm"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                />
                {style.image && (
                  <div className="position-relative" style={{ width: '50px', height: '50px' }}>
                    <img
                      src={style.image}
                      alt={style.name}
                      className="img-thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger position-absolute top-0 end-0"
                      style={{ padding: '0px 4px', fontSize: '10px' }}
                      onClick={() => handleOptionChange(index, 'image', '')}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={style.isDefault}
                onChange={(e) => handleOptionChange(index, 'isDefault', e.target.checked)}
                id={`default-${index}`}
              />
              <label className="form-check-label" htmlFor={`default-${index}`}>
                Default Selection
              </label>
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={addStyle}
        >
          Add Style
        </button>
      </div>

      <div className="mb-3">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showEdit"
            checked={config.showEdit}
            onChange={(e) => onChange('showEdit', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showEdit">
            Show Edit Button
          </label>
        </div>
      </div>
    </div>
  );
};

export default BasicSettings;