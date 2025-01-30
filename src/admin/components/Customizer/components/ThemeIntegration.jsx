import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ThemeIntegration = ({ onBack }) => {
  const [embedStatus, setEmbedStatus] = useState('Deactivated');
  const [currentTheme, setCurrentTheme] = useState({
    id: '15.2.0',
    name: 'Dawn',
    role: 'Current theme',
    version: '15.2.0',
    lastSaved: '1:43 am EST'
  });
  const [loading, setLoading] = useState(false);

  // Load initial embed status from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('appEmbedStatus');
    if (savedStatus) {
      setEmbedStatus(savedStatus);
    }
  }, []);

  // Handle embed/remove app
  const handleEmbedToggle = () => {
    setLoading(true);
    
    setTimeout(() => {
      try {
        const newStatus = embedStatus === 'Activated' ? 'Deactivated' : 'Activated';
        setEmbedStatus(newStatus);
        localStorage.setItem('appEmbedStatus', newStatus);
        
        // Show appropriate toast message
        if (newStatus === 'Activated') {
          toast.success('Successfully embedded app in Dawn theme!');
        } else {
          toast.warning('App removed from Dawn theme');
        }
      } catch (error) {
        toast.error('Failed to update app embed status');
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // Open theme editor (using actual theme URL)
  const openThemeEditor = () => {
    // For development environment, show toast
    if (window.location.hostname === 'localhost') {
      toast.info('Theme editor would open in production environment');
      return;
    }
    
    // In production, this would open the actual theme editor
    window.open(`https://admin.shopify.com/store/your-store/themes/${currentTheme.id}/editor`, '_blank');
  };

  return (
    <div className="theme-setup p-4">
      {/* Back Button */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-link text-decoration-none p-0 text-primary"
          onClick={onBack}
        >
          <i className="fa fa-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <h2 className="mb-4">Theme Setup</h2>

      {/* App Embed Status Section */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">App embed</label>
            <div className="d-flex align-items-center">
              <span className={`badge ${embedStatus === 'Activated' ? 'bg-success' : 'bg-secondary'}`}>
                {embedStatus}
              </span>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="mb-3">
            <label className="form-label">Current Theme</label>
            <select className="form-select" disabled>
              <option>{`${currentTheme.name} (${currentTheme.role})`}</option>
            </select>
            <small className="text-muted d-block mt-1">Version: {currentTheme.version}</small>
            <small className="text-muted d-block">Last saved: {currentTheme.lastSaved}</small>
          </div>

          {/* Development Mode Warning */}
          {window.location.hostname === 'localhost' && (
            <div className="alert alert-warning mb-3">
              <i className="fa fa-exclamation-triangle me-2"></i>
              Your online store is in development mode. Theme editor functionality will be limited.
            </div>
          )}

          {/* Help Text */}
          <p className="text-muted mb-3">
            To display options on your Online Store, you must enable app embed in your theme.
          </p>

          {/* Action Buttons */}
          <div className="d-flex gap-2">
            <button 
              className={`btn ${embedStatus === 'Activated' ? 'btn-danger' : 'btn-primary'}`}
              onClick={handleEmbedToggle}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa fa-spinner fa-spin me-2"></i>
                  Processing...
                </>
              ) : (
                embedStatus === 'Activated' ? 'Remove App' : 'Embed App'
              )}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={openThemeEditor}
              disabled={embedStatus !== 'Activated'}
            >
              Go to Theme Editor
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {embedStatus === 'Activated' && (
        <div className="alert alert-success mb-4">
          <i className="fa fa-check-circle me-2"></i>
          App is embedded in Dawn theme
        </div>
      )}

      {/* Info Message */}
      <div className="alert alert-info">
        <i className="fa fa-info-circle me-2"></i>
        After embedding the app, you can customize its appearance in the theme editor.
      </div>
    </div>
  );
};

export default ThemeIntegration; 