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
router.get('/api/themes', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest({session});
    
    const response = await client.get({
      path: 'themes',
    });

    res.json(response);
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ error: 'Failed to fetch themes' });
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
router.get('/api/app-embed/status', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest({session});
    
    const {themes} = await client.get({
      path: 'themes',
    });
    const mainTheme = themes.find(theme => theme.role === 'main');

    // Check if app block is installed
    const appBlockCheck = await client.get({
      path: `themes/${mainTheme.id}/assets`,
      query: {asset: {'key': 'blocks/app-block.liquid'}}
    }).catch(() => null);

    res.json({
      status: appBlockCheck ? 'activated' : 'deactivated'
    });

  } catch (error) {
    console.error('Error checking app embed status:', error);
    res.status(500).json({ error: 'Failed to check app embed status' });
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
    const shop = process.env.SHOP_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // Create GraphQL client
    const client = new Shopify.Clients.Graphql(shop, accessToken);

    // Enable app embed
    const response = await client.query({
      data: {
        query: `mutation {
          appEmbedCreate(input: {
            enabled: true
          }) {
            appEmbed {
              enabled
            }
            userErrors {
              field
              message
            }
          }
        }`
      },
    });

    if (response.body.data.appEmbedCreate.userErrors.length > 0) {
      throw new Error(response.body.data.appEmbedCreate.userErrors[0].message);
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
    const shop = process.env.SHOP_DOMAIN;
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;

    // Create GraphQL client
    const client = new Shopify.Clients.Graphql(shop, accessToken);

    // Add app block to theme
    const response = await client.query({
      data: {
        query: `mutation {
          themeAppExtensionCreate(
            input: {
              title: "Product Customizer"
              type: THEME_APP_EXTENSION
            }
          ) {
            themeAppExtension {
              id
            }
            userErrors {
              field
              message
            }
          }
        }`
      }
    });

    if (response.body.data.themeAppExtensionCreate.userErrors.length > 0) {
      throw new Error(response.body.data.themeAppExtensionCreate.userErrors[0].message);
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

// Register app embed
router.post('/api/shopify/register-embed', async (req, res) => {
  try {
    const client = new Shopify.Clients.Graphql(
      process.env.SHOP_DOMAIN,
      process.env.SHOPIFY_ACCESS_TOKEN
    );

    const response = await client.query({
      data: {
        query: `mutation {
          appEmbedCreate(input: {
            enabled: true,
            embedType: PRODUCT_PAGE,
            targetElement: "product-customizer"
          }) {
            appEmbed {
              enabled
            }
            userErrors {
              field
              message
            }
          }
        }`
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error registering app embed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Register extension
router.post('/shopify/register-extension', async (req, res) => {
  try {
    // For testing, let's just return success
    console.log('Attempting to register extension...');
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Enable app embed
router.post('/api/shopify/enable-embed', async (req, res) => {
  try {
    const client = new Shopify.Clients.Graphql(req.session.shop, req.session.accessToken);
    
    const response = await client.query({
      data: {
        query: `mutation {
          appEmbedCreate(input: {
            enabled: true
          }) {
            appEmbed {
              enabled
            }
            userErrors {
              field
              message
            }
          }
        }`
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Embed Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Check theme installation status
router.get('/api/theme/status', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest({session});

    // Get current theme ID
    const {themes} = await client.get({
      path: 'themes',
    });
    const mainTheme = themes.find(theme => theme.role === 'main');

    // Check if our files exist
    const snippetCheck = await client.get({
      path: `themes/${mainTheme.id}/assets`,
      query: {asset: {'key': 'snippets/product-customizer.liquid'}}
    }).catch(() => null);

    const sectionCheck = await client.get({
      path: `themes/${mainTheme.id}/assets`,
      query: {asset: {'key': 'sections/product-customizer.liquid'}}
    }).catch(() => null);

    const blockCheck = await client.get({
      path: `themes/${mainTheme.id}/assets`,
      query: {asset: {'key': 'blocks/product-customizer.liquid'}}
    }).catch(() => null);

    res.json({
      snippetInstalled: !!snippetCheck,
      sectionInstalled: !!sectionCheck,
      blockInstalled: !!blockCheck
    });

  } catch (error) {
    console.error('Error checking theme status:', error);
    res.status(500).json({ error: 'Failed to check installation status' });
  }
});

// Install theme files
router.post('/api/theme/install', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.Clients.Rest({session});

    // Get current theme ID
    const {themes} = await client.get({
      path: 'themes',
    });
    const mainTheme = themes.find(theme => theme.role === 'main');

    // Install snippet
    await client.put({
      path: `themes/${mainTheme.id}/assets`,
      data: {
        asset: {
          key: 'snippets/product-customizer.liquid',
          value: `{% comment %} Product Customizer App Integration {% endcomment %}
<script src="{{ 'product-customizer.js' | asset_url }}"></script>
<link rel="stylesheet" href="{{ 'product-customizer.css' | asset_url }}">

<div id="product-customizer" 
  data-product-id="{{ product.id }}"
  data-variant-id="{{ product.selected_or_first_available_variant.id }}">
</div>`
        }
      }
    });

    // Install section
    await client.put({
      path: `themes/${mainTheme.id}/assets`,
      data: {
        asset: {
          key: 'sections/product-customizer.liquid',
          value: `{% render 'product-customizer' %}`
        }
      }
    });

    // Install block
    await client.put({
      path: `themes/${mainTheme.id}/assets`,
      data: {
        asset: {
          key: 'blocks/product-customizer.liquid',
          value: `{% render 'product-customizer' %}`
        }
      }
    });

    res.json({ success: true });

  } catch (error) {
    console.error('Error installing theme files:', error);
    res.status(500).json({ error: 'Failed to install theme files' });
  }
});

// Toggle app embed status
router.post('/api/app-embed/toggle', async (req, res) => {
  try {
    const session = res.locals.shopify.session;
    const client = new Shopify.clients.Rest({session});
    const { themeId, action } = req.body;

    if (action === 'activate') {
      // Enable app block in theme
      await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: 'blocks/app-block.liquid',
            value: `{% schema %}
{
  "name": "Product Customizer",
  "target": "section",
  "stylesheet": "app.css",
  "javascript": "app.js",
  "settings": []
}
{% endschema %}

{% render 'product-customizer' %}`
          }
        }
      });

      // Add app embed code to theme.liquid
      const themeContent = await client.get({
        path: `themes/${themeId}/assets`,
        query: {asset: {'key': 'layout/theme.liquid'}}
      });

      if (!themeContent.body.includes('app-embed-container')) {
        const updatedContent = themeContent.body.replace(
          '</body>',
          '<div class="app-embed-container"></div></body>'
        );

        await client.put({
          path: `themes/${themeId}/assets`,
          data: {
            asset: {
              key: 'layout/theme.liquid',
              value: updatedContent
            }
          }
        });
      }

    } else {
      // Disable app block
      await client.delete({
        path: `themes/${themeId}/assets`,
        query: {asset: {'key': 'blocks/app-block.liquid'}}
      });

      // Remove app embed code from theme.liquid
      const themeContent = await client.get({
        path: `themes/${themeId}/assets`,
        query: {asset: {'key': 'layout/theme.liquid'}}
      });

      const updatedContent = themeContent.body.replace(
        '<div class="app-embed-container"></div>',
        ''
      );

      await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: 'layout/theme.liquid',
            value: updatedContent
          }
        }
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error('Error toggling app embed:', error);
    res.status(500).json({ error: 'Failed to toggle app embed' });
  }
});

export default router; 