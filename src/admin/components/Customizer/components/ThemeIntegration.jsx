import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/ThemeIntegration.css';

const ThemeIntegration = ({ onBack }) => {
  // Static themes data for testing
  const staticThemes = [
    {
      id: "128755464321",
      name: "Dawn",
      role: "main",
      theme_store_id: 887,
    },
    {
      id: "128755464322",
      name: "Debut",
      role: "unpublished",
      theme_store_id: 796,
    }
  ];

  const [selectedTheme, setSelectedTheme] = useState('');
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [availableThemes, setAvailableThemes] = useState(staticThemes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set default theme (main theme)
    const mainTheme = staticThemes.find(theme => theme.role === 'main');
    if (mainTheme) {
      setSelectedTheme(mainTheme.id);
    }
  }, []);

  const handleGoToThemeEditor = () => {
    if (!selectedTheme) {
      toast.error('Please select a theme first');
      return;
    }

    const shop = 'quick-start-b5afd779';
    const url = `https://admin.shopify.com/store/${shop}/themes/${selectedTheme}/editor?context=apps`;
    window.open(url, '_blank');
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
          {/* App Embed Toggle */}
          <div className="mb-4">
            <label className="form-label">App embed</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={appEmbed === 'activated'}
                onChange={() => setAppEmbed(prev => prev === 'activated' ? 'deactivated' : 'activated')}
                style={{ cursor: 'pointer' }}
              />
              <span className="ms-2">{appEmbed}</span>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-4">
            <label className="form-label">Select Theme</label>
            <select
              className="form-select"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              disabled={loading}
            >
              <option value="">Select a theme</option>
              {availableThemes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.name} {theme.role === 'main' ? '(Current theme)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Editor Button */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-dark"
              onClick={handleGoToThemeEditor}
              disabled={!selectedTheme || appEmbed !== 'activated'}
            >
              Go to Theme Editor
            </button>
            <a 
              href="#" 
              className="text-primary text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                window.open('https://help.shopify.com/en/manual/online-store/themes/theme-structure/app-embeddings', '_blank');
              }}
            >
              How to enable app embed?
            </a>
          </div>

          {/* Info Message */}
          {appEmbed === 'deactivated' && (
            <div className="alert alert-info mt-3">
              Please activate app embed first to customize it in Theme Editor
            </div>
          )}
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