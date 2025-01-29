import express from 'express';
import { Shopify } from '@shopify/shopify-api';

const router = express.Router();

// Get all themes
router.get('/api/themes', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    const response = await client.get({
      path: 'themes',
    });

    res.json({ themes: response.body.themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ error: 'Failed to load themes' });
  }
});

// Get app embed status
router.get('/api/app-embed/status', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    
    // Get current theme
    const themesResponse = await client.get({
      path: 'themes',
    });
    
    const mainTheme = themesResponse.body.themes.find(theme => theme.role === 'main');
    
    // Check if app block is installed
    const themeResponse = await client.get({
      path: `themes/${mainTheme.id}/assets`,
    });
    
    const hasAppBlock = themeResponse.body.assets.some(asset => 
      asset.key === 'sections/product-customizer.liquid'
    );

    res.json({ status: hasAppBlock ? 'activated' : 'deactivated' });
  } catch (error) {
    console.error('Error checking app embed status:', error);
    res.status(500).json({ error: 'Failed to check app embed status' });
  }
});

// Toggle app embed
router.post('/api/app-embed/toggle', async (req, res) => {
  try {
    console.log('Received toggle request:', req.body);
    const { action } = req.body;
    const session = res.locals.shopify.session;
    
    console.log('Session:', session);

    if (!session) {
      throw new Error('No session found');
    }

    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    console.log('Client created');

    if (action === 'activate') {
      console.log('Activating app embed...');
      // Add app block to theme
      const response = await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: 'sections/product-customizer.liquid',
            value: `
              <div class="product-customizer-app">
                {% render 'product-customizer' %}
              </div>
              {% schema %}
              {
                "name": "Product Customizer",
                "target": "section",
                "settings": []
              }
              {% endschema %}
            `
          }
        }
      });
      console.log('App block added:', response);
    }

    res.json({ status: action === 'activate' ? 'activated' : 'deactivated' });
  } catch (error) {
    console.error('Error in toggle endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to toggle app embed',
      details: error.stack
    });
  }
});

export default router; 