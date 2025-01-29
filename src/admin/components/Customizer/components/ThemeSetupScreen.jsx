import React, { useState, useEffect } from 'react';

const ThemeSetupScreen = ({ onBack }) => {
  const [appEmbedStatus, setAppEmbedStatus] = useState('deactivated');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('inactive');

  useEffect(() => {
    fetchThemes();
    checkAppEmbedStatus();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/themes');
      const data = await response.json();
      setThemes(data.themes || []);
      if (data.themes?.length > 0) {
        setSelectedTheme(data.themes[0].id);
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      alert('Failed to load themes');
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

  const handleActivate = async () => {
    setIsLoading(true);
    console.log('Activating app embed...');

    try {
      const response = await fetch('/api/app-embed/toggle', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'activate'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle app embed');
      }

      const data = await response.json();
      setStatus(data.status);
      console.log('Toggle successful:', data);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const goToThemeEditor = () => {
    const shopUrl = window.shopOrigin;
    window.open(`https://${shopUrl}/admin/themes/current/editor`, '_blank');
  };

  return (
    <div>
      <button onClick={onBack} className="btn btn-link mb-3">
        <i className="fas fa-arrow-left"></i> Back
      </button>
      <div className="card">
        <div className="card-body">
          <h2 className="card-title">Theme Setup</h2>
          
          {/* App Embed Status */}
          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <h4 className="mb-0 me-3">App Embed</h4>
              <span className={`badge ${appEmbedStatus === 'activated' ? 'bg-success' : 'bg-warning'}`}>
                {appEmbedStatus === 'activated' ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* Theme Selection */}
            <select 
              className="form-select mb-3"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              {themes.map(theme => (
                <option key={theme.id} value={theme.id}>
                  {theme.name} {theme.role === 'main' ? '(Live theme)' : ''}
                </option>
              ))}
            </select>

            <p className="text-muted">
              To display product options on your store, you need to enable app embed in your theme.
            </p>

            {/* Action Buttons */}
            <div className="d-flex gap-2">
              <button 
                className={`btn ${appEmbedStatus === 'activated' ? 'btn-danger' : 'btn-success'}`}
                onClick={handleActivate}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : appEmbedStatus === 'activated' ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                className="btn btn-primary"
                onClick={goToThemeEditor}
              >
                Go to Theme Editor
              </button>
            </div>
          </div>

          {/* Installation Guide */}
          <div className="alert alert-info">
            <h4>Manual Installation Guide</h4>
            <div className="mt-3">
              <h5>1. Add to product template:</h5>
              <div className="bg-light p-2 rounded">
                <code>{'{% render "product-customizer" %}'}</code>
              </div>
              
              <h5 className="mt-3">2. Add app block to section:</h5>
              <div className="bg-light p-2 rounded">
                <code>{"{% section 'product-customizer' %}"}</code>
              </div>
            </div>
          </div>

          {/* Installation Status */}
          <div className="mt-4">
            <h4>Installation Status</h4>
            <div className="list-group">
              <div className="list-group-item d-flex justify-content-between align-items-center">
                App Block
                <span className={`badge ${appEmbedStatus === 'activated' ? 'bg-success' : 'bg-warning'}`}>
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