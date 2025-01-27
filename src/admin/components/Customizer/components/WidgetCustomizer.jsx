import React, { useState } from 'react';

const WidgetCustomizer = () => {
  const [settings, setSettings] = useState({
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745'
    },
    typography: {
      fontFamily: 'Arial',
      fontSize: '16px',
      headingColor: '#212529'
    },
    layout: {
      containerPadding: '20px',
      borderRadius: '8px',
      spacing: '16px'
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    localStorage.setItem('widgetSettings', JSON.stringify(settings));
    toast.success('Widget settings saved successfully!');
  };

  return (
    <div className="widget-customizer">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="text-center mb-4">
            <h3>Customize Widget</h3>
            <p className="text-muted">Customize the appearance of your product customizer</p>
          </div>

          <div className="customization-sections">
            {/* Colors Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Colors</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {Object.entries(settings.colors).map(([key, value]) => (
                    <div className="col-md-4" key={key}>
                      <label className="form-label text-capitalize">{key} Color</label>
                      <input
                        type="color"
                        className="form-control form-control-color w-100"
                        value={value}
                        onChange={(e) => handleSettingChange('colors', key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Typography</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Font Family</label>
                    <select
                      className="form-select"
                      value={settings.typography.fontFamily}
                      onChange={(e) => handleSettingChange('typography', 'fontFamily', e.target.value)}
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Font Size</label>
                    <input
                      type="text"
                      className="form-control"
                      value={settings.typography.fontSize}
                      onChange={(e) => handleSettingChange('typography', 'fontSize', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Section */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Layout</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {Object.entries(settings.layout).map(([key, value]) => (
                    <div className="col-md-4" key={key}>
                      <label className="form-label text-capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={value}
                        onChange={(e) => handleSettingChange('layout', key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="btn btn-primary btn-lg" onClick={handleSave}>
                <i className="fa fa-save"></i> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetCustomizer; 