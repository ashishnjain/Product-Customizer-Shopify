import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const ThemeSetupScreen = () => {
  const [appEmbedStatus, setAppEmbedStatus] = useState('deactivated');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [themes, setThemes] = useState([]);
  
  // Fetch themes and embed status on component mount
  useEffect(() => {
    fetchThemes();
    checkAppEmbedStatus();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      const data = await response.json();
      setThemes(data.themes);
      // Set first theme as default selected
      if (data.themes.length > 0) {
        setSelectedTheme(data.themes[0].id);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to load themes');
    }
  };

  const checkAppEmbedStatus = async () => {
    try {
      const response = await fetch('/api/app-embed/status');
      const data = await response.json();
      setAppEmbedStatus(data.status);
    } catch (error) {
      console.error('Error checking app embed status:', error);
    }
  };

  const handleThemeChange = (e) => {
    setSelectedTheme(e.target.value);
  };

  const goToThemeEditor = () => {
    // Open Shopify theme editor in new tab
    const shopifyAdmin = window.shopify.config.shopOrigin;
    window.open(
      `https://${shopifyAdmin}/admin/themes/${selectedTheme}/editor?context=apps&template=product`,
      '_blank'
    );
  };

  const toggleAppEmbed = async () => {
    try {
      const response = await fetch('/api/app-embed/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          themeId: selectedTheme,
          action: appEmbedStatus === 'activated' ? 'deactivate' : 'activate'
        })
      });

      if (response.ok) {
        const newStatus = appEmbedStatus === 'activated' ? 'deactivated' : 'activated';
        setAppEmbedStatus(newStatus);
        toast.success(`App embed ${newStatus} successfully!`);
      } else {
        toast.error('Failed to toggle app embed');
      }
    } catch (error) {
      console.error('Error toggling app embed:', error);
      toast.error('Failed to toggle app embed');
    }
  };

  return (
    <div className="container-fluid p-4">
      <ToastContainer />
      
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">Theme Setup</h5>

          {/* App Embed Status with Toggle Button */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2">
              <span>App embed</span>
              <button 
                onClick={toggleAppEmbed}
                className={`btn btn-sm ${
                  appEmbedStatus === 'activated' 
                    ? 'btn-success' 
                    : 'btn-warning'
                }`}
                style={{ minWidth: '100px' }}
              >
                {appEmbedStatus === 'activated' ? 'Activated' : 'Deactivated'}
              </button>
            </div>
            
            {/* Theme Selection Dropdown */}
            <select 
              className="form-select my-3" 
              value={selectedTheme}
              onChange={handleThemeChange}
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name} {theme.role === 'main' ? '(Live theme)' : ''}
                </option>
              ))}
            </select>

            <p className="text-muted small">
              To display options on your Online Store, you must enable app embed in your theme.
            </p>

            {/* Theme Editor Button */}
            <div className="d-flex gap-3">
              <button 
                className="btn btn-dark"
                onClick={goToThemeEditor}
              >
                Go to Theme Editor
              </button>
              <a href="#" className="btn btn-link">
                How to enable app embed?
              </a>
            </div>
          </div>

          {/* Installation Status */}
          <div className="mt-4">
            <h6>Installation Status</h6>
            <div className="list-group">
              <div className="list-group-item d-flex justify-content-between align-items-center">
                App Block
                <span className={`badge ${
                  appEmbedStatus === 'activated' 
                    ? 'bg-success' 
                    : 'bg-warning'
                }`}>
                  {appEmbedStatus === 'activated' ? 'Installed' : 'Not Installed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSetupScreen; 