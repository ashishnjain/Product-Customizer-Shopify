import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/ThemeIntegration.css';

const ThemeIntegration = ({ onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [availableThemes, setAvailableThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch themes using Shopify Admin API
  const fetchThemes = async () => {
    try {
      const shop = 'quick-start-b5afd779.myshopify.com';
      const response = await fetch(`/api/shopify/themes?shop=${shop}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch themes');
      }
      
      const data = await response.json();
      console.log('Themes data:', data); // Debug log
      
      if (data.themes && Array.isArray(data.themes)) {
        setAvailableThemes(data.themes);
        const mainTheme = data.themes.find(theme => theme.role === 'main');
        if (mainTheme) {
          setSelectedTheme(mainTheme.id.toString());
        }
      } else {
        throw new Error('Invalid themes data received');
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error(error.message);
    }
  };

  // Check app embed status
  const checkAppEmbedStatus = async () => {
    try {
      const shop = 'quick-start-b5afd779.myshopify.com';
      const response = await fetch(`/api/shopify/app-status?shop=${shop}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to check app status');
      }
      
      const data = await response.json();
      console.log('App status:', data); // Debug log
      
      setAppEmbed(data.isEnabled ? 'activated' : 'deactivated');
    } catch (error) {
      console.error('Error checking app status:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
    checkAppEmbedStatus();
  }, []);

  const handleAppEmbedToggle = async (checked) => {
    try {
      const shop = 'quick-start-b5afd779.myshopify.com';
      const response = await fetch('/api/shopify/toggle-embed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          shop,
          enabled: checked,
          themeId: selectedTheme
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update app embed status');
      }
      
      setAppEmbed(checked ? 'activated' : 'deactivated');
      toast.success(`App embed ${checked ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling app embed:', error);
      toast.error(error.message);
      // Revert the toggle if there was an error
      setAppEmbed(prev => prev === 'activated' ? 'deactivated' : 'activated');
    }
  };

  const handleGoToThemeEditor = () => {
    const shop = 'quick-start-b5afd779'; // Your shop name
    const themeId = selectedTheme;
    const url = `https://admin.shopify.com/store/${shop}/themes/${themeId}/editor?context=apps`;
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
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {/* App Embed Status Toggle */}
              <div className="mb-4">
                <label className="form-label d-flex align-items-center">
                  <span className="me-3">App embed</span>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={appEmbed === 'activated'}
                      onChange={(e) => handleAppEmbedToggle(e.target.checked)}
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
                    <option key={theme.id} value={theme.id}>
                      {theme.name} {theme.role === 'main' ? '(Current theme)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {appEmbed === 'deactivated' && (
                <div className="alert alert-info">
                  To display options on your Online Store, you must enable app embed in your theme.
                </div>
              )}

              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-dark"
                  onClick={handleGoToThemeEditor}
                >
                  Go to Theme Editor
                </button>
                <a href="#" className="text-primary text-decoration-none">
                  How to enable app embed?
                </a>
              </div>
            </>
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