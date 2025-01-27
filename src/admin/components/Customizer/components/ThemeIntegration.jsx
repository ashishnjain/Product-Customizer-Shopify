import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/ThemeIntegration.css';

const ThemeIntegration = ({ onBack }) => {
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState({
    id: "128755464321",
    name: "Dawn",
    role: "main"
  });

  const handleEmbedClick = async () => {
    try {
      setLoading(true);
      // Toggle the app embed status
      const newStatus = appEmbed === 'deactivated' ? 'activated' : 'deactivated';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppEmbed(newStatus);
      toast.success(`App ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to toggle app embed');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeEditorClick = () => {
    if (appEmbed !== 'activated') {
      toast.error('Please activate app embed first');
      return;
    }

    const shop = 'quick-start-b5afd779';
    const url = `https://admin.shopify.com/store/${shop}/themes/${selectedTheme.id}/editor?context=apps`;
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
          {/* App Embed Section */}
          <div className="mb-4">
            <label className="form-label">App embed</label>
            <div>
              <button
                className="btn btn-secondary"
                onClick={handleEmbedClick}
                disabled={loading}
                style={{ cursor: 'pointer' }}
              >
                {loading ? 'Processing...' : 'Click to Embed App'}
              </button>
              {appEmbed === 'activated' && (
                <span className="ms-2 text-success">
                  ✓ App is embedded
                </span>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-4">
            <label className="form-label">Select Theme</label>
            <select
              className="form-select"
              value={`${selectedTheme.name} (Current theme)`}
              disabled
            >
              <option>{selectedTheme.name} (Current theme)</option>
            </select>
          </div>

          {/* Theme Editor Button */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-dark"
              onClick={handleThemeEditorClick}
              disabled={appEmbed !== 'activated'}
              style={{ cursor: appEmbed === 'activated' ? 'pointer' : 'not-allowed' }}
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
              How to enable app embed?s
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