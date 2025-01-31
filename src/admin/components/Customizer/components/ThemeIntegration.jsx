import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAppBridge } from '@shopify/app-bridge-react';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { Redirect } from '@shopify/app-bridge/actions';

const ThemeIntegration = ({ onBack }) => {
  const [appEmbed, setAppEmbed] = useState('deactivated');
  const [loading, setLoading] = useState(false);
  const app = useAppBridge();

  const handleEmbedClick = async () => {
    try {
      setLoading(true);
      const fetch = authenticatedFetch(app);

      // Get current theme ID
      const themesResponse = await fetch('/admin/api/2024-01/themes.json');
      const themes = await themesResponse.json();
      const activeTheme = themes.themes.find(theme => theme.role === 'main');

      if (!activeTheme) {
        throw new Error('No active theme found');
      }

      // Add app block to theme
      const response = await fetch(`/admin/api/2024-01/themes/${activeTheme.id}/assets.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: {
            key: "sections/product-customizer.liquid",
            value: `
              <div class="product-customizer-app">
                <div id="product-customizer-root"></div>
              </div>
              {% schema %}
              {
                "name": "Product Customizer",
                "target": "section",
                "templates": ["product"],
                "settings": []
              }
              {% endschema %}
            `
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add app block');
      }

      setAppEmbed('activated');
      toast.success('App block added successfully!');
    } catch (error) {
      console.error('Embed error:', error);
      toast.error(`Failed to embed app: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openThemeEditor = () => {
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.ADMIN_PATH,
      '/themes/current/editor'
    );
  };

  return (
    <div className="theme-setup-container p-4">
      <div className="card">
        <div className="card-body">
          <div className="mb-4">
            <label className="form-label">App embed</label>
            <div>
              <button
                className={`btn ${appEmbed === 'activated' ? 'btn-success' : 'btn-secondary'}`}
                onClick={handleEmbedClick}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Click to ${appEmbed === 'activated' ? 'Deactivate' : 'Embed'} App`}
              </button>
              {appEmbed === 'activated' && (
                <span className="ms-2 text-success">✓ App is embedded</span>
              )}
            </div>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={openThemeEditor}
            disabled={appEmbed !== 'activated'}
          >
            Go to Theme Editor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeIntegration;