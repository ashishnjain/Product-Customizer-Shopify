import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';
import { addAppBlockToTheme } from '../middleware/themeService';

const router = express.Router();

// Add this at the top of your file
const debug = true; // Enable debug mode

// Get session function
const getShopifySession = async (shop) => {
  const session = {
    shop: shop,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    isActive: () => true
  };
  return session;
};

// Test route
router.get('/api/shopify/test', (req, res) => {
  res.json({ message: 'Shopify routes working' });
});

// Get all themes
router.get('/api/shopify/themes', (req, res) => {
  try {
    // Hardcoded theme data for testing
    const themes = {
      success: true,
      themes: [
        {
          id: "128755464321",
          name: "Dawn",
          role: "main",
          theme_store_id: 887,
          previewable: true,
          processing: false
        },
        {
          id: "128755464322",
          name: "Debut",
          role: "unpublished",
          theme_store_id: 796,
          previewable: true,
          processing: false
        }
      ]
    };

    res.json(themes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check theme status
router.get('/api/shopify/theme-status/:themeId', async (req, res) => {
  try {
    const { themeId } = req.params;
    const shop = 'quick-start-b5afd779.myshopify.com';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    const response = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${themeId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json({ theme: data.theme });

  } catch (error) {
    console.error('Error checking theme:', error);
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

// Get current theme
router.get('/api/shopify/current-theme', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const response = await client.get({
      path: 'themes',
    });

    const mainTheme = response.body.themes.find(theme => theme.role === 'main');

    res.json({ 
      success: true, 
      theme: mainTheme 
    });
  } catch (error) {
    console.error('Error fetching theme:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Check embed status
router.get('/api/shopify/check-embed-status', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    const { body: { themes } } = await client.get({
      path: 'themes',
    });

    const mainTheme = themes.find(theme => theme.role === 'main');

    // Check if app block exists
    const { body: { asset } } = await client.get({
      path: `themes/${mainTheme.id}/assets/sections/product-customizer.liquid`,
    }).catch(() => ({ body: { asset: null } }));

    res.json({
      success: true,
      isEmbedded: !!asset
    });

  } catch (error) {
    console.error('Error checking embed status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Embed/Remove app
router.post('/api/shopify/embed-app', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const { themeId, action } = req.body;
    
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

    if (action === 'activate') {
      // Add app block
      await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: "sections/product-customizer.liquid",
            value: `{% schema %}
              {
                "name": "Product Customizer",
                "target": "section",
                "enabled_on": {
                  "templates": ["product"]
                },
                "settings": [
                  {
                    "type": "text",
                    "id": "heading",
                    "label": "Heading",
                    "default": "Customize Your Product"
                  }
                ]
              }
              {% endschema %}

              <div id="product-customizer-root">
                {{ block.settings.heading }}
              </div>`
          }
        },
      });

      res.json({
        success: true,
        message: 'App embedded successfully'
      });
    } else {
      // Remove app block
      await client.delete({
        path: `themes/${themeId}/assets/sections/product-customizer.liquid`,
      });

      res.json({
        success: true,
        message: 'App removed successfully'
      });
    }
  } catch (error) {
    console.error('Error updating app embed:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get theme editor URL
router.get('/api/shopify/theme-editor-url', (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const { themeId } = req.query;
    
    const url = `https://admin.shopify.com/store/${session.shop}/themes/${themeId}/editor`;
    
    res.json({ 
      success: true, 
      url 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get all products
router.get('/api/shopify/products', async (req, res) => {
  try {
    const shop = 'quick-start-b5afd779.myshopify.com';
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    
    const data = await response.json();
    res.json(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get all collections
router.get('/api/shopify/collections', async (req, res) => {
  try {
    const shop = 'quick-start-b5afd779.myshopify.com';
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/collections.json`,
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    
    const data = await response.json();
    res.json(data.collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

export default router;