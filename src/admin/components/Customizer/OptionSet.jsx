import React, { useState } from "react";

const OptionSet = ({ onAddOption }) => {
  const [optionName, setOptionName] = useState("");
  const [optionType, setOptionType] = useState("text");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (optionName.trim()) {
      onAddOption({
        name: optionName,
        type: optionType,
        id: Date.now(),
      });
      setOptionName("");
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h3>Add New Option</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Option Name</label>
          <input
            type="text"
            className="form-control"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
            placeholder="Enter option name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Option Type</label>
          <select
            className="form-select"
            value={optionType}
            onChange={(e) => setOptionType(e.target.value)}
          >
            <option value="text">Text</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Option
        </button>
      </form>
    </div>
  );
};

export default OptionSet;
