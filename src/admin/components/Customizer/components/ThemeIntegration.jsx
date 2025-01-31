import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAppBridge } from '@shopify/app-bridge-react';
import { Redirect } from '@shopify/app-bridge/actions';

const ThemeIntegration = ({ onBack }) => {
  const [embedStatus, setEmbedStatus] = useState('Deactivated');
  const [loading, setLoading] = useState(false);
  const app = useAppBridge();

  const openThemeEditor = useCallback(() => {
    try {
      const shop = new URLSearchParams(window.location.search).get('shop') || 'quick-start-b5afd779.myshopify.com';
      
      // First try App Bridge navigation
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.REMOTE,
        `https://${shop}/admin/themes/current/editor?context=apps&template=product&activateAppId=${process.env.REACT_APP_SHOPIFY_API_KEY}`
      );

      // Fallback direct navigation after short delay if App Bridge fails
      setTimeout(() => {
        const editorUrl = `https://${shop}/admin/themes/current/editor?context=apps&template=product`;
        if (window.top !== window.self) {
          window.top.location.href = editorUrl;
        } else {
          window.location.href = editorUrl;
        }
      }, 1000);

    } catch (error) {
      console.error('Theme editor navigation error:', error);
      
      // Final fallback - direct theme editor URL
      const fallbackUrl = `https://admin.shopify.com/store/${shop}/themes/current/editor`;
      window.top.location.href = fallbackUrl;
      
      toast.error('Having trouble opening Theme Editor. Trying alternate method...');
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
    <div className="theme-setup-container p-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Theme Integration</h5>
          
          {/* Status Display */}
          <div className="mb-3">
            <strong>Status:</strong> {embedStatus}
          </div>

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
              disabled={embedStatus !== 'Activated'}
            >
              Go to Theme Editor
            </button>
          </div>

          {/* Instructions */}
          {embedStatus === 'Activated' && (
            <div className="alert alert-info mt-3">
              <h6>Next Steps:</h6>
              <ol className="mb-0">
                <li>Click "Go to Theme Editor"</li>
                <li>Look for "App embeds" in the left sidebar</li>
                <li>Find "Product Customizer" in the list</li>
                <li>Enable the app using the toggle switch</li>
                <li>Save your changes</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeIntegration;