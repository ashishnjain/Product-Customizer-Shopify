import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';
import { authenticateShopify } from '../middleware/auth.js';

const router = express.Router();

// Add authentication middleware to all routes
router.use(authenticateShopify);

// Update shop domain to use env variable
const SHOP_DOMAIN = process.env.SHOP_DOMAIN;
const ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

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

// Toggle app embed
router.post('/api/shopify/toggle-embed', async (req, res) => {
  if (debug) console.log('Received toggle request:', req.body);
  
  try {
    const { themeId, enabled } = req.body;
    
    if (!themeId) {
      throw new Error('Theme ID is required');
    }

    if (debug) console.log('Processing toggle for theme:', themeId, 'enabled:', enabled);

    const shop = 'quick-start-b5afd779.myshopify.com';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (enabled) {
      // 1. Create the app block file
      console.log('Creating app block...'); // Debug log
      const appBlockResponse = await fetch(
        `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asset: {
              key: 'sections/product-customizer.liquid',
              value: `
                <div class="product-customizer-app">
                  <div id="product-customizer-root"></div>
                </div>

                {% schema %}
                {
                  "name": "Product Customizer",
                  "target": "section",
                  "javascript": "product-customizer.js",
                  "stylesheet": "product-customizer.css",
                  "settings": [],
                  "presets": [
                    {
                      "name": "Product Customizer"
                    }
                  ]
                }
                {% endschema %}
              `
            }
          })
        }
      );

      if (!appBlockResponse.ok) {
        const errorData = await appBlockResponse.json();
        console.error('App block creation failed:', errorData); // Debug log
        throw new Error('Failed to create app block');
      }

      // 2. Get current product template
      console.log('Getting product template...'); // Debug log
      const templateResponse = await fetch(
        `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=templates/product.json`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          }
        }
      );

      if (!templateResponse.ok) {
        const errorData = await templateResponse.json();
        console.error('Template fetch failed:', errorData); // Debug log
        throw new Error('Failed to fetch product template');
      }

      const templateData = await templateResponse.json();
      let template = JSON.parse(templateData.asset.value);

      // 3. Add app section to template if not exists
      if (!template.sections.some(section => section.type === 'product-customizer')) {
        console.log('Adding app section to template...'); // Debug log
        template.sections['product-customizer'] = {
          "type": "product-customizer",
          "settings": {}
        };

        // Save updated template
        const updateResponse = await fetch(
          `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
          {
            method: 'PUT',
            headers: {
              'X-Shopify-Access-Token': accessToken,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              asset: {
                key: 'templates/product.json',
                value: JSON.stringify(template, null, 2)
              }
            })
          }
        );

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          console.error('Template update failed:', errorData); // Debug log
          throw new Error('Failed to update product template');
        }
      }
    }

    if (debug) console.log('Toggle completed successfully');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Toggle error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: debug ? error.stack : undefined
    });
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

// Embed app in theme
router.post('/api/shopify/embed-app', async (req, res) => {
  try {
    const { themeId, block } = req.body;
    const shop = 'quick-start-b5afd779.myshopify.com';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // 1. Get current theme content
    const themeResponse = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    // 2. Add app block to theme
    const updateResponse = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          asset: {
            key: 'templates/product.json',
            value: JSON.stringify({
              // Add app block to product template
              sections: {
                main: {
                  type: 'main-product',
                  blocks: {
                    app: {
                      type: '@app'
                    }
                  }
                }
              }
            })
          }
        })
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update theme');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error embedding app:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add app block to theme
router.post('/api/shopify/theme/block', async (req, res) => {
  try {
    const { themeId } = req.body;
    const shop = process.env.SHOP_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // 1. Get current theme
    const themeResponse = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${themeId}.json`,
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
        },
      }
    );

    if (!themeResponse.ok) {
      throw new Error('Failed to fetch theme');
    }

    // 2. Add app block
    const appBlock = {
      asset: {
        key: "templates/product.json",
        value: JSON.stringify({
          sections: {
            main: {
              type: "main-product",
              blocks: {
                product_customizer: {
                  type: "@app"
                }
              },
              block_order: ["product_customizer"]
            }
          },
          order: ["main"]
        })
      }
    };

    const updateResponse = await fetch(
      `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appBlock)
      }
    );

    if (!updateResponse.ok) {
      throw new Error('Failed to update theme');
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all products
router.get('/api/shopify/products', async (req, res) => {
  try {
    const response = await fetch(
      `https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`,
      {
        headers: {
          'X-Shopify-Access-Token': ACCESS_TOKEN,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data.products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Get all collections
router.get('/api/shopify/collections', async (req, res) => {
  try {
    const shop = 'quick-start-b5afd779.myshopify.com';
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/custom_collections.json`,
      {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    
    const data = await response.json();
    res.json(data.custom_collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

export default router; 