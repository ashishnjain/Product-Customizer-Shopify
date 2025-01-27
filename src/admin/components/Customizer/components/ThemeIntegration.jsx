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
      const response = await fetch('/api/shopify/themes');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch themes');
      }
      
      const data = await response.json();
      console.log('Themes data:', data); // Debug log

      if (data.themes && Array.isArray(data.themes)) {
        setAvailableThemes(data.themes);
        
        // Set active theme as selected
        const activeTheme = data.themes.find(theme => theme.isActive);
        if (activeTheme) {
          setSelectedTheme(activeTheme.id);
          console.log('Selected active theme:', activeTheme); // Debug log
        }
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (themeId) => {
    setSelectedTheme(themeId);
    // Fetch theme status when theme changes
    checkThemeStatus(themeId);
  };

  const checkThemeStatus = async (themeId) => {
    try {
      const response = await fetch(`/api/shopify/theme-status/${themeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check theme status');
      }
      
      const data = await response.json();
      console.log('Theme status:', data); // Debug log
    } catch (error) {
      console.error('Error checking theme:', error);
      toast.error('Failed to check theme status');
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
                  <option value="">Select a theme</option>
                  {availableThemes.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name} {theme.isActive ? '(Current theme)' : ''}
                    </option>
                  ))}
                </select>
                {loading && <div className="mt-2">Loading themes...</div>}
              </div>

              {appEmbed === 'deactivated' && (
                <div className="alert alert-info">
                  To display options on your Online Store, you must enable app embed in your theme.
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