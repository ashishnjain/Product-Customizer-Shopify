import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/ThemeIntegration.css';

const ThemeIntegration = ({ onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [availableThemes, setAvailableThemes] = useState([]);

  // Fetch available themes (this would normally come from Shopify API)
  useEffect(() => {
    // Simulating API call to get themes
    const themes = [
      { id: 1, name: 'Dawn', status: 'current theme' },
      { id: 2, name: 'Dawn (Live theme)', status: 'live' }
    ];
    setAvailableThemes(themes);
    setSelectedTheme('Dawn'); // Set default theme
  }, []);

  const handleGoToThemeEditor = () => {
    // Using the local development URL structure
    const baseUrl = '127.0.0.1:3000';
    const storePath = 'admin.shopify.com/store/quick-start-b5afd779';
    const themePath = 'themes/150278701356/editor';
    const queryParams = 'context=apps&appEmbed=fdc9fad5-1a0f-4bd4-9c8a-1af6a6eef6b8%2Fapp-embed';
    
    const themeEditorUrl = `http://${baseUrl}/${storePath}/${themePath}?${queryParams}`;
    
    // Open in the same window
    window.location.href = themeEditorUrl;
    
    // Alternatively, to open in a new tab:
    // window.open(themeEditorUrl, '_blank');
  };

  return (
    <div className="theme-setup-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Theme Setup</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={onBack}
        >
          <i className="fa fa-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          {/* App Embed Status Toggle */}
          <div className="mb-4">
            <label className="form-label d-flex align-items-center">
              <span className="me-3">App embed</span>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={appEmbed === 'activated'}
                  onChange={(e) => setAppEmbed(e.target.checked ? 'activated' : 'deactivated')}
                />
                <span className="ms-2">{appEmbed}</span>
              </div>
            </label>
          </div>

          {/* Theme Selection Dropdown */}
          <div className="mb-4">
            <select
              className="form-select"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              {availableThemes.map((theme) => (
                <option key={theme.id} value={theme.name}>
                  {theme.name} {theme.status === 'current theme' && '(Current theme)'}
                </option>
              ))}
            </select>
          </div>

          <p className="text-muted mb-4">
            To display options on your Online Store, you must enable app embed in your theme.
          </p>

          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-dark"
              onClick={handleGoToThemeEditor}
            >
              Go to Theme Editor
            </button>
            <a href="#" className="text-primary text-decoration-none">
              How to enabled app embed?
            </a>
          </div>
        </div>
      </div>

      {/* Widget Personalization Section */}
      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h3 className="h5 mb-3">Widget personalization</h3>
              <p className="text-muted mb-3">
                Need to change the look of our app? Send us your personalization requirements. 
                Our experts are here to make the app fit perfectly with your theme style.
              </p>
              <a href="#" className="btn btn-outline-primary">
                Contact us here - It's free
              </a>
            </div>
            <div className="ms-4">
              <img 
                src="/widget-customization-icon.png" 
                alt="Widget Customization"
                style={{ width: '100px', height: '100px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeIntegration; 