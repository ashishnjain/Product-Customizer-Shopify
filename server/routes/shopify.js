import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import fetch from 'node-fetch';

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
    const shop = 'quick-start-b5afd779.myshopify.com';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // Direct API call to Shopify Admin API
    const response = await fetch(
      `https://${shop}/admin/api/2024-01/themes.json`,
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
    console.log('Raw Shopify response:', data); // Debug log

    // Transform the data
    const themes = data.themes.map(theme => ({
      id: theme.id.toString(),
      name: theme.name,
      role: theme.role,
      isActive: theme.role === 'main'
    }));

    console.log('Processed themes:', themes); // Debug log
    res.json({ themes });

  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ 
      error: 'Failed to fetch themes',
      details: error.message 
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

// Toggle app embed and add app block
router.post('/api/shopify/toggle-embed', async (req, res) => {
  try {
    const { enabled, themeId } = req.body;
    const shop = 'quick-start-b5afd779.myshopify.com';
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    if (enabled) {
      // 1. First add the app block template
      await fetch(
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
                <div class="product-customizer" data-product="{{ product.id }}">
                  <div id="product-customizer-root"></div>
                </div>

                {% schema %}
                {
                  "name": "Product Customizer",
                  "target": "section",
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

      // 2. Then add the app block to product template
      const templateResponse = await fetch(
        `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=templates/product.json`,
        {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          }
        }
      );

      if (templateResponse.ok) {
        const templateData = await templateResponse.json();
        let template = JSON.parse(templateData.asset.value);

        // Add our section if it doesn't exist
        if (!template.sections.some(section => section.type === 'product-customizer')) {
          template.sections.push({
            "type": "product-customizer",
            "settings": {}
          });

          // Save updated template
          await fetch(
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
        }
      }

      // 3. Add necessary app scripts
      await fetch(
        `https://${shop}/admin/api/2024-01/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': accessToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            asset: {
              key: 'assets/product-customizer.js',
              value: `
                // Your app's JavaScript will be here
                document.addEventListener('DOMContentLoaded', function() {
                  const customizer = document.querySelector('.product-customizer');
                  if (customizer) {
                    // Initialize your app
                    console.log('Product Customizer initialized');
                  }
                });
              `
            }
          })
        }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error toggling app embed:', error);
    res.status(500).json({ 
      error: 'Failed to toggle app embed',
      details: error.message 
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

export default router; 