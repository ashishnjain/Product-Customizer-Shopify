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

  const handleEmbedClick = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/shopify/theme/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to embed app');
      }

      setAppEmbed('activated');
      toast.success('App successfully embedded in theme!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to embed app. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleThemeEditorClick = () => {
    try {
      const shop = 'quick-start-b5afd779';
      const themeId = '174724251948';
      window.open(`https://admin.shopify.com/store/${shop}/themes/${themeId}/editor`, '_blank');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to open theme editor');
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
          <h5>App embed</h5>
          <button 
            className={`btn ${appEmbed === 'activated' ? 'btn-success' : 'btn-primary'}`}
            onClick={handleEmbedClick}
            disabled={loading}
          >
            {loading ? 'Embedding...' : (appEmbed === 'activated' ? 'App Embedded' : 'Click to Embed App')}
          </button>

          <div className="mt-4">
            <h5>Select Theme</h5>
            <select className="form-select mb-3" disabled>
              <option>Dawn (Current theme)</option>
            </select>

            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-dark"
                onClick={handleThemeEditorClick}
                disabled={appEmbed !== 'activated'}
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

            {appEmbed === 'deactivated' && (
              <div className="alert alert-info mt-3">
                Please activate app embed first to customize it in Theme Editor
              </div>
            )}
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