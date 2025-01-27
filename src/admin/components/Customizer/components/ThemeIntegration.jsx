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
      console.log('Fetching themes...'); // Debug log

      const response = await fetch('/api/shopify/themes');
      console.log('Themes API response:', response); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData); // Debug log
        throw new Error(errorData.error || 'Failed to fetch themes');
      }

      const data = await response.json();
      console.log('Themes data:', data); // Debug log

      if (data.success && data.themes) {
        setAvailableThemes(data.themes);
        // Set active theme as default
        const activeTheme = data.themes.find(theme => theme.role === 'main');
        if (activeTheme) {
          setSelectedTheme(activeTheme.id);
        }
      } else {
        throw new Error('No themes data received');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to load themes');
    } finally {
      setLoading(false);
    }
  };

  // Simple toggle function
  const toggleAppEmbed = () => {
    setAppEmbed(appEmbed === 'deactivated' ? 'activated' : 'deactivated');
  };

  const handleGoToThemeEditor = () => {
    try {
      // Get shop name from your environment or config
      const shop = 'quick-start-b5afd779';
      
      // Get current theme ID
      const currentTheme = availableThemes.find(theme => theme.role === 'main');
      
      if (!currentTheme) {
        toast.error('No active theme found');
        return;
      }

      // Construct the URL with correct parameters
      const url = `https://admin.shopify.com/store/${shop}/themes/${currentTheme.id}/editor?context=apps&activateAppId=customisationapp-1`;
      
      console.log('Opening theme editor:', url);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening theme editor:', error);
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
          {/* App Embed Toggle */}
          <div className="mb-4">
            <label className="form-label">App embed</label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={appEmbed === 'activated'}
                onChange={() => setAppEmbed(prev => prev === 'activated' ? 'deactivated' : 'activated')}
              />
              <span className="ms-2">{appEmbed}</span>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-4">
            <label className="form-label">Select Theme</label>
            {loading ? (
              <div>Loading themes...</div>
            ) : availableThemes.length > 0 ? (
              <select
                className="form-select"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
              >
                <option value="">Select a theme</option>
                {availableThemes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name} {theme.role === 'main' ? '(Current theme)' : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="alert alert-warning">
                No themes found. Please check your store settings.d
              </div>
            )}
          </div>

          {/* Theme Editor Button */}
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-dark"
              onClick={handleGoToThemeEditor}
              style={{ cursor: 'pointer' }}
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
              Please activate app embed first to customize it in Theme Editors
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