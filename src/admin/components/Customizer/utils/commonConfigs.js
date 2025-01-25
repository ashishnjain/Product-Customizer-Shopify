export const commonWidthOptions = [
  { value: '25', label: '25%' },
  { value: '33.33', label: '33.33%' },
  { value: '50', label: '50%' },
  { value: '67.67', label: '67.67%' },
  { value: '75', label: '75%' },
  { value: '100', label: '100%' }
];

// Common width selector component
export const WidthSelector = ({ value, onChange }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Field Width</label>
      <select
        className="form-select"
        value={value || '100'}
        onChange={(e) => onChange('width', e.target.value)}
      >
        {commonWidthOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 