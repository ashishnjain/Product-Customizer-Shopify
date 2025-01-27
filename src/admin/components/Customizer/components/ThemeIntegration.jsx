import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../styles/ThemeIntegration.css';

const ThemeIntegration = ({ onBack }) => {
  const [selectedTheme, setSelectedTheme] = useState('');
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [availableThemes, setAvailableThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const shop = 'quick-start-b5afd779.myshopify.com';
      const response = await fetch(`/api/shopify/themes?shop=${shop}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch themes');
      }
      
      const data = await response.json();
      console.log('Fetched themes:', data);
      
      if (data.themes && Array.isArray(data.themes)) {
        setAvailableThemes(data.themes);
        
        // Set active theme as selected
        const activeTheme = data.themes.find(theme => theme.role === 'main');
        if (activeTheme) {
          setSelectedTheme(activeTheme.id);
          // Check if app is embedded in this theme
          checkThemeAppBlock(activeTheme.id);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  const checkThemeAppBlock = async (themeId) => {
    try {
      const shop = 'quick-start-b5afd779.myshopify.com';
      const response = await fetch(`/api/shopify/check-theme/${themeId}?shop=${shop}`);
      
      if (!response.ok) throw new Error('Failed to check theme');
      
      const data = await response.json();
      setAppEmbed(data.hasAppBlock ? 'activated' : 'deactivated');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleThemeChange = async (themeId) => {
    setSelectedTheme(themeId);
    await checkThemeAppBlock(themeId);
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
            <div className="text-center">Loading themes...</div>
          ) : (
            <>
              <div className="mb-4">
                <label className="form-label">App embed</label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={appEmbed === 'activated'}
                    onChange={(e) => setAppEmbed(e.target.checked ? 'activated' : 'deactivated')}
                  />
                  <span className="ms-2">{appEmbed}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Select Theme</label>
                <select
                  className="form-select"
                  value={selectedTheme}
                  onChange={(e) => handleThemeChange(e.target.value)}
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
                  To display options on your Online Store, you must enable app embed in your themes.
                </div>
              )}

              <div className="d-flex align-items-center gap-3">
                <button
                  className="btn btn-dark"
                  onClick={() => {
                    const shop = 'quick-start-b5afd779';
                    window.open(
                      `https://admin.shopify.com/store/${shop}/themes/${selectedTheme}/editor?context=apps`,
                      '_blank'
                    );
                  }}
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