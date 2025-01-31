import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';
import { getSessionToken } from "@shopify/app-bridge-utils";

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
  const [showInstructions, setShowInstructions] = useState(false);
  const app = useAppBridge();

  // Load initial embed status from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('appEmbedStatus');
    if (savedStatus) {
      setEmbedStatus(savedStatus);
    }
  }, []);

  const openThemeEditor = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get the shop from URL
      const params = new URLSearchParams(window.location.search);
      const shop = params.get('shop') || 'quick-start-b5afd779.myshopify.com';
      
      // Get current theme ID
      const sessionToken = await getSessionToken(app);
      const response = await fetch('/api/shopify/themes/current', {
        headers: {
          Authorization: `Bearer ${sessionToken}`
        }
      });
      
      const { themeId } = await response.json();
      
      // Use Redirect action to navigate
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.ADMIN_PATH,
        `/themes/${themeId}/editor?context=apps`
      );

    } catch (error) {
      console.error('Navigation error:', error);
      toast.error('Failed to open Theme Editor. Please try refreshing the page.');
      
      // Fallback navigation
      const shop = new URLSearchParams(window.location.search).get('shop');
      if (shop) {
        window.location.href = `https://${shop}/admin/themes/current/editor`;
      }
    } finally {
      setLoading(false);
    }
  }, [app]);

  const handleEmbedToggle = async () => {
    try {
      setLoading(true);
      const newStatus = embedStatus === 'Activated' ? 'Deactivated' : 'Activated';
      setEmbedStatus(newStatus);
      
      if (newStatus === 'Activated') {
        toast.success('App successfully embedded! Click "Go to Theme Editor" to complete setup.');
      } else {
        toast.info('App removed from theme');
      }
    } catch (error) {
      console.error('Embed toggle error:', error);
      toast.error('Failed to update app status');
    } finally {
      setLoading(false);
    }
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

          {showInstructions && (
            <div className="alert alert-info mb-3">
              <h5 className="alert-heading">
                <i className="fa fa-info-circle me-2"></i>
                Follow these steps to complete setup:
              </h5>
              <ol className="mb-0">
                <li className="mb-2">Click "Go to Theme Editor" button below</li>
                <li className="mb-2">In Theme Editor, click on "App embeds" in the left sidebar</li>
                <li className="mb-2">Find "Product Customizer" in the list</li>
                <li className="mb-2">Toggle the switch to enable the app</li>
                <li>Save the changes</li>
              </ol>
            </div>
          )}

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
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                embedStatus === 'Activated' ? 'Remove App' : 'Embed App'
              )}
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={openThemeEditor}
              disabled={embedStatus !== 'Activated' || loading}
            >
              {loading ? 'Opening...' : 'Go to Theme Editor'}
            </button>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {embedStatus === 'Activated' && !showInstructions && (
        <div className="alert alert-success mb-4">
          <i className="fa fa-check-circle me-2"></i>
          App is embedded in Dawn theme
        </div>
      )}

      {/* Info Message */}
      <div className="alert alert-warning">
        <i className="fa fa-exclamation-triangle me-2"></i>
        <strong>Important:</strong> After clicking "Embed App", you must enable the app in Theme Editor's App embeds section.
      </div>
    </div>
  );
};

export default ThemeIntegration; 