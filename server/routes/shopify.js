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
    const session = res.locals.shopify.session;
    const shop = session.shop;
    const accessToken = session.accessToken;

    // Create GraphQL client
    const client = new Shopify.Clients.Graphql(shop, accessToken);

    // GraphQL mutation to enable app embedding
    const response = await client.query({
      data: `mutation {
        appSubscriptionCreate(
          name: "Product Customizer App"
          returnUrl: "${process.env.SHOPIFY_APP_URL}"
          test: true
          lineItems: [
            {
              plan: {
                appRecurringPricingDetails: {
                    price: { amount: 0, currencyCode: USD }
                }
              }
            }
          ]
        ) {
          userErrors {
            field
            message
          }
          confirmationUrl
          appSubscription {
            id
          }
        }
      }`
    });

    // Enable app embedding
    await client.query({
      data: `mutation {
        appEmbedCreate(input: {
          title: "Product Customizer"
          type: PRODUCT_PAGE
          enabled: true
        }) {
          appEmbed {
            id
          }
          userErrors {
            field
            message
          }
        }
      }`
    });

    res.json({ 
      success: true, 
      message: 'App embedded successfully'
    });

  } catch (error) {
    console.error('Error embedding app:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to embed app'
    });
  }
});

// Add app block to theme
router.post('/api/shopify/add-app-block', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const { themeId } = req.body;
    const shop = session.shop;

    // Create a new client
    const client = new Shopify.Clients.Rest(shop, session.accessToken);

    // First, check if the app block already exists
    const { body: { assets } } = await client.get({
      path: `themes/${themeId}/assets`,
    });

    // App block content
    const appBlockContent = `
      {% schema %}
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
      </div>
    `;

    // Add or update the app block
    await client.put({
      path: `themes/${themeId}/assets`,
      data: {
        asset: {
          key: "sections/product-customizer.liquid",
          value: appBlockContent
        }
      },
    });

    // Add snippet for app embed
    const snippetContent = `
      <script>
        window.productCustomizerSettings = {
          shop: "${shop}",
          themeId: "${themeId}"
        };
      </script>
      <div id="product-customizer-container"></div>
    `;

    await client.put({
      path: `themes/${themeId}/assets`,
      data: {
        asset: {
          key: "snippets/product-customizer.liquid",
          value: snippetContent
        }
      },
    });

    // Success response
    res.json({
      success: true,
      message: 'App block and snippet added successfully'
    });

  } catch (error) {
    console.error('Error adding app block:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add app block'
    });
  }
});

// Get theme editor URL
router.get('/api/shopify/theme-editor', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const shop = session.shop;
    const themeId = req.query.themeId;

    res.json({
      success: true,
      url: `https://admin.shopify.com/store/${shop}/themes/${themeId}/editor`
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
      `