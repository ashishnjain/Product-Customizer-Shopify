import React from "react";

const OptionPreview = ({ options }) => {
  return (
    <div className="card p-3">
      <h3>Preview</h3>
      {options.length === 0 ? (
        <p className="text-muted">No options added yet</p>
      ) : (
        <div className="list-group">
          {options.map((option) => (
            <div key={option.id} className="list-group-item">
              <h5>{option.name}</h5>
              <p className="text-muted mb-0">Type: {option.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionPreview;
