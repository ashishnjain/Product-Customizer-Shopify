import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ThemeIntegration = () => {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(null);

  // Check initial embed status and get current theme
  useEffect(() => {
    checkEmbedStatus();
    getCurrentTheme();
  }, []);

  // Get current theme
  const getCurrentTheme = async () => {
    try {
      const response = await fetch('/api/shopify/current-theme');
      const data = await response.json();
      if (data.success && data.theme) {
        setCurrentTheme(data.theme);
      }
    } catch (error) {
      console.error('Error getting theme:', error);
      toast.error('Failed to get current theme');
    }
  };

  // Check if app is already embedded
  const checkEmbedStatus = async () => {
    try {
      const response = await fetch('/api/shopify/check-embed-status');
      const data = await response.json();
      if (data.success) {
        setIsEmbedded(data.isEmbedded);
      }
    } catch (error) {
      console.error('Error checking embed status:', error);
    }
  };

  // Handle embed/remove app
  const handleEmbedToggle = async () => {
    if (!currentTheme) {
      toast.error('No theme selected');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/shopify/embed-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          themeId: currentTheme.id,
          action: isEmbedded ? 'deactivate' : 'activate'
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsEmbedded(!isEmbedded);
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to update app embed status');
    } finally {
      setLoading(false);
    }
  };

  // Open theme editor
  const openThemeEditor = () => {
    if (!currentTheme) return;
    
    const shop = window.shopOrigin;
    if (!shop) {
      toast.error('Shop information not found');
      return;
    }

    const cleanShopName = shop.replace(/(^\w+:|^)\/\//, '').replace('.myshopify.com', '');
    const editorUrl = `https://admin.shopify.com/store/${cleanShopName}/themes/${currentTheme.id}/editor`;
    window.open(editorUrl, '_blank');
  };

  return (
    <div className="theme-setup p-4">
      <h2 className="mb-4">Theme Setup</h2>

      {/* Current Theme */}
      <div className="mb-4">
        <label className="form-label">Current Theme</label>
        <input 
          type="text" 
          className="form-control" 
          value={currentTheme?.name || 'Loading...'} 
          disabled 
        />
      </div>

      {/* Embed Controls */}
      <div className="mb-4">
        <button
          className={`btn ${isEmbedded ? 'btn-danger' : 'btn-primary'} me-3`}
          onClick={handleEmbedToggle}
          disabled={loading || !currentTheme}
        >
          {loading ? (
            <span>
              <i className="fa fa-spinner fa-spin me-2"></i>
              Processing...
            </span>
          ) : (
            isEmbedded ? 'Remove App' : 'Embed App'
          )}
        </button>

        <button
          className="btn btn-secondary"
          onClick={openThemeEditor}
          disabled={!isEmbedded || !currentTheme}
        >
          Open Theme Editor
        </button>
      </div>

      {/* Status Message */}
      {isEmbedded && (
        <div className="alert alert-success">
          <i className="fa fa-check-circle me-2"></i>
          App is embedded in your theme
        </div>
      )}

      {/* Help Text */}
      <div className="alert alert-info mt-4">
        <i className="fa fa-info-circle me-2"></i>
        After embedding the app, you can customize its appearance in the theme editor.
      </div>
    </div>
  );
};

export default ThemeIntegration; 