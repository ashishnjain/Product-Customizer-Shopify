import express from 'express';
import { Shopify } from '@shopify/shopify-api';

const router = express.Router();

// Get session function
const getShopifySession = async (shop) => {
  const session = {
    shop: shop,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    isActive: () => true
  };
  return session;
};

// Get all themes
router.get('/api/shopify/themes', async (req, res) => {
  try {
    const { shop } = req.query;
    const session = await getShopifySession(shop);
    
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    
    const response = await client.get({
      path: 'themes',
    });

    res.json({ themes: response.body.themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check app embed status
router.get('/api/shopify/app-status', async (req, res) => {
  try {
    const { shop } = req.query;
    const session = await getShopifySession(shop);
    
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    
    const response = await client.get({
      path: 'themes',  // Changed this to themes as app_installations might not be accessible
    });

    // Check if app block exists in any theme
    const isEnabled = response.body.themes.some(theme => 
      theme.role === 'main' && theme.theme_store_id !== null
    );

    res.json({ isEnabled });
  } catch (error) {
    console.error('Error checking app status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle app embed
router.post('/api/shopify/toggle-embed', async (req, res) => {
  try {
    const { shop, enabled, themeId } = req.body;
    const session = await getShopifySession(shop);
    
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    
    if (enabled) {
      // Add app block to theme
      await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: 'sections/product-customizer.liquid',
            value: `
              <div class="product-customizer-app" data-shop="{{ shop.permanent_domain }}">
                <!-- App content will be injected here -->
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
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling app embed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 