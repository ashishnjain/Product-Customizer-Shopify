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
    const shop = req.query.shop;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // Using Admin REST API
    const client = new Shopify.Clients.Rest(shop, accessToken);
    
    const response = await client.get({
      path: 'themes',
    });

    // Transform and log the response
    console.log('Raw themes response:', response.body);
    
    const themes = response.body.themes.map(theme => ({
      id: theme.id.toString(),
      name: theme.name,
      role: theme.role,
      isActive: theme.role === 'main'
    }));

    console.log('Processed themes:', themes);
    res.json({ themes });
  } catch (error) {
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to fetch themes',
      details: error.message 
    });
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
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    
    const client = new Shopify.Clients.Rest(shop, accessToken);
    
    if (enabled) {
      // First, create the app block template
      await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: 'sections/product-customizer.liquid',
            value: `
              <div class="product-customizer-app" 
                   data-shop="{{ shop.permanent_domain }}"
                   data-product-id="{{ product.id }}">
                <!-- App content will be injected here -->
              </div>
              {% schema %}
              {
                "name": "Product Customizer",
                "target": "section",
                "javascript": "product-customizer.js",
                "stylesheet": "product-customizer.css",
                "settings": [
                  {
                    "type": "checkbox",
                    "id": "enabled",
                    "label": "Enable Customizer",
                    "default": true
                  }
                ],
                "presets": [
                  {
                    "name": "Product Customizer"
                  }
                ]
              }
              {% endschema %}
            `
          }
        }
      });

      // Then, add the app block to the product template
      const templateResponse = await client.get({
        path: `themes/${themeId}/assets`,
        query: { asset: { key: 'templates/product.json' } }
      });

      if (templateResponse.body.asset) {
        const template = JSON.parse(templateResponse.body.asset.value);
        
        // Add our section if it doesn't exist
        if (!template.sections.some(section => section.type === 'product-customizer')) {
          template.sections.push({
            type: 'product-customizer',
            settings: {
              enabled: true
            }
          });

          // Save the updated template
          await client.put({
            path: `themes/${themeId}/assets`,
            data: {
              asset: {
                key: 'templates/product.json',
                value: JSON.stringify(template, null, 2)
              }
            }
          });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling app embed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check if theme has app block
router.get('/api/shopify/check-theme/:themeId', async (req, res) => {
  try {
    const { themeId } = req.params;
    const { shop } = req.query;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    
    const client = new Shopify.Clients.Rest(shop, accessToken);
    
    const response = await client.get({
      path: `themes/${themeId}/assets`,
    });

    const hasAppBlock = response.body.assets.some(
      asset => asset.key === 'sections/product-customizer.liquid'
    );

    res.json({ hasAppBlock });
  } catch (error) {
    console.error('Error checking theme:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 