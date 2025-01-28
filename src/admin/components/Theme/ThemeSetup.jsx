import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ThemeSetup = () => {
  const navigate = useNavigate();
  const [isEmbedding, setIsEmbedding] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);

  // Fetch current theme on component mount
  useEffect(() => {
    fetchCurrentTheme();
  }, []);

  const fetchCurrentTheme = async () => {
    try {
      const response = await fetch('/api/shopify/themes');
      const data = await response.json();
      const mainTheme = data.themes.find(theme => theme.role === 'main');
      setCurrentTheme(mainTheme);
    } catch (error) {
      console.error('Error fetching theme:', error);
      toast.error('Failed to fetch theme');
    }
  };

  const handleEmbedClick = async () => {
    try {
      setIsEmbedding(true);
      const response = await fetch('/api/shopify/theme/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          themeId: currentTheme?.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to embed app');
      }

      setIsEmbedded(true);
      toast.success('App successfully embedded!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to embed app');
    } finally {
      setIsEmbedding(false);
    }
  };

  const handleThemeEditorClick = () => {
    const shop = 'quick-start-b5afd779';
    const themeId = currentTheme?.id;
    if (themeId) {
      window.open(
        `https://admin.shopify.com/store/${shop}/themes/${themeId}/editor`,
        '_blank'
      );
    } else {
      toast.error('Theme ID not found');
    }
  };

  const handleContactClick = () => {
    window.location.href = 'mailto:support@example.com?subject=Widget Customization Request';
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Theme Setup</h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/admin/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {/* App Embed Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>App embed</h5>
          <button 
            className={`btn ${isEmbedded ? 'btn-success' : 'btn-primary'}`}
            onClick={handleEmbedClick}
            disabled={isEmbedding || isEmbedded}
          >
            {isEmbedding ? 'Embedding...' : (isEmbedded ? 'App Embedded' : 'Click to Embed App')}
          </button>
        </div>
      </div>

      {/* Theme Selection Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h5>Select Theme</h5>
          <select className="form-select mb-3" disabled>
            <option>{currentTheme?.name || 'Dawn'} (Current theme)</option>
          </select>

          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-secondary"
              onClick={handleThemeEditorClick}
              disabled={!isEmbedded}
            >
              Go to Theme Editor
            </button>
            <a 
              href="https://help.shopify.com/manual/online-store/themes/theme-structure/app-embeddings" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary text-decoration-none"
            >
              How to enable app embed?
            </a>
          </div>

          {!isEmbedded && (
            <div className="alert alert-info mt-3">
              Please activate app embed first to customize it in Theme Editor
            </div>
          )}
        </div>
      </div>

      {/* Widget Personalization Section */}
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5>Widget personalization</h5>
              <p className="text-muted">
                Need to change the look of our app? Send us your personalization requirements. Our experts are here to make the app fit perfectly with your theme style.
              </p>
              <button 
                className="btn btn-outline-primary"
                onClick={handleContactClick}
              >
                Contact us here - It's free
              </button>
            </div>
            <div className="col-md-4">
              <img 
                src="/images/widget-customization.png" 
                alt="Widget Customization" 
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSetup; 