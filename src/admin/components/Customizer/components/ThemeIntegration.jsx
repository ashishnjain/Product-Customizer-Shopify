import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../styles/ThemeIntegration.css';

const ThemeIntegration = ({ onBack }) => {
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState({
    id: "174724251948",
    name: "Dawn",
    role: "main"
  });

  // Define theme editor function first
  const openThemeEditor = () => {
    const shop = window.shopOrigin || 'quick-start-b5afd779';
    const themeId = selectedTheme.id;
    const url = `https://admin.shopify.com/store/${shop}/themes/${themeId}/editor`;
    window.open(url, '_blank');
  };

  // Handle embed click
  const handleEmbedClick = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/shopify/embed-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAppEmbed('activated');
        toast.success('App embedded successfully in Shopify!');
        
        // Refresh app blocks in theme
        if (window.shopify?.app?.reloadAppBlocks) {
          window.shopify.app.reloadAppBlocks();
        }
      } else {
        throw new Error(data.message || 'Failed to embed app');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
      setAppEmbed('deactivated');
    } finally {
      setLoading(false);
    }
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
          {/* App Embed Button */}
          <div className="mb-4">
            <label className="form-label">App embed</label>
            <div>
              <button
                className={`btn ${appEmbed === 'activated' ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleEmbedClick}
                disabled={loading}
              >
                {loading ? (
                  <span>
                    <i className="fa fa-spinner fa-spin me-2"></i>
                    Embedding App...
                  </span>
                ) : (
                  <span>Click to {appEmbed === 'activated' ? 'Update' : 'Embed'} App</span>
                )}
              </button>
              {appEmbed === 'activated' && (
                <span className="ms-2 text-success">
                  <i className="fa fa-check-circle me-1"></i>
                  App is embedded in Shopify
                </span>
              )}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-4">
            <label className="form-label">Select Theme</label>
            <select 
              className="form-select" 
              value={selectedTheme.id}
              onChange={(e) => setSelectedTheme({ ...selectedTheme, id: e.target.value })}
            >
              <option value={selectedTheme.id}>Dawn (Current theme)</option>
            </select>
          </div>

          {/* Theme Editor Button */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-dark"
              onClick={openThemeEditor}
              disabled={appEmbed !== 'activated'}
            >
              Go to Theme Editor
            </button>
            <a 
              href="https://help.shopify.com/en/manual/online-store/themes/theme-structure/app-embeddings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-decoration-none"
            >
              How to enable app embed?
            </a>
          </div>

          {/* Info Message */}
          <div className="alert alert-info">
            <i className="fa fa-info-circle me-2"></i>
            This will embed the app in your Shopify store and make it available in the theme editor.
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