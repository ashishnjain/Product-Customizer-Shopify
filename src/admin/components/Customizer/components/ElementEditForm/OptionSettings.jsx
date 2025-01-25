<div className="mb-3">
  <div className="form-check">
    <input
      type="checkbox"
      className="form-check-input"
      id="isDefaultOpen"
      checked={option.isDefaultOpen || false}
      onChange={(e) => handleOptionChange("isDefaultOpen", e.target.checked)}
    />
    <label className="form-check-label" htmlFor="isDefaultOpen">
      Open by Default
    </label>
    <small className="form-text text-muted d-block">
      If checked, this option will be opened by default in the product page
    </small>
  </div>
</div> 