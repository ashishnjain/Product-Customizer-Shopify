import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ThemeIntegration = ({ onBack }) => {
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState({
    id: '',
    name: 'Dawn',
    role: 'main'
  });

  // Check if app is embedded on component mount
  useEffect(() => {
    checkAppEmbedStatus();
    fetchCurrentTheme();
  }, []);

  const checkAppEmbedStatus = async () => {
    try {
      const response = await fetch('/api/shopify/check-embed-status');
      const data = await response.json();
      if (data.success && data.isEmbedded) {
        setAppEmbed('activated');
      }
    } catch (error) {
      console.error('Error checking embed status:', error);
    }
  };

  const fetchCurrentTheme = async () => {
    try {
      const response = await fetch('/api/shopify/current-theme');
      const data = await response.json();
      if (data.theme) {
        setSelectedTheme(data.theme);
      }
    } catch (error) {
      console.error('Error fetching theme:', error);
    }
  };

  const handleEmbedClick = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/shopify/embed-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          themeId: selectedTheme.id,
          action: appEmbed === 'activated' ? 'deactivate' : 'activate'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAppEmbed(appEmbed === 'activated' ? 'deactivated' : 'activated');
        toast.success(data.message);
      } else {
        throw new Error(data.message || 'Failed to update app embed status');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeEditorClick = () => {
    const shop = window.shopOrigin;
    if (!shop) {
      toast.error('Shop information not found');
      return;
    }

    // Remove any http/https prefix and .myshopify.com suffix
    const cleanShopName = shop.replace(/(^\w+:|^)\/\//, '').replace('.myshopify.com', '');
    const editorUrl = `https://admin.shopify.com/store/${cleanShopName}/themes/${selectedTheme.id}/editor`;
    window.open(editorUrl, '_blank');
  };

  return (
    <div className="theme-setup-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Theme Setup</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={onBack}
        >
          <i className="fa fa-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          {/* App Embed Section */}
          <div className="mb-4">
            <label className="form-label">App embed</label>
            <div>
              <button
                className={`btn ${appEmbed === 'activated' ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleEmbedClick}
                disabled={loading || !selectedTheme.id}
              >
                {loading ? (
                  <span>
                    <i className="fa fa-spinner fa-spin me-2"></i>
                    Processing...
                  </span>
                ) : (
                  <span>
                    {appEmbed === 'activated' ? 'Deactivate App' : 'Click to Embed App'}
                  </span>
                )}
              </button>
              {appEmbed === 'activated' && (
                <span className="ms-2 text-success">
                  <i className="fa fa-check-circle me-2"></i>
                  App is embedded
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
            >
              Go to Theme Editor
            </button>
            <a 
              href="https://help.shopify.com/en/manual/online-store/themes/theme-structure/app-embeddings"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              How to enable app embed?
            </a>
          </div>

          <div className="alert alert-info mt-3">
            <i className="fa fa-info-circle me-2"></i>
            This will embed the app in your Shopify store and make it available in the theme editor.
          </div>
        </div>
      </div>

      {/* Widget Personalization Card */}
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <div>
              <h3 className="h5 mb-3">Widget personalization</h3>
              <p className="text-muted mb-3">
                Need to change the look of our app? Send us your personalization requirements. 
                Our experts are here to make the app fit perfectly with your theme style.
              </p>
              <a 
                href="mailto:support@yourapp.com?subject=Widget Customization Request"
                className="btn btn-outline-primary"
              >
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