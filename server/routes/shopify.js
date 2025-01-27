import express from 'express';
import { Shopify } from '@shopify/shopify-api';

const router = express.Router();

// Get all themes
router.get('/api/shopify/themes', async (req, res) => {
  try {
    const { shop } = req.query;
    const client = new Shopify.Clients.Rest(shop, process.env.SHOPIFY_ACCESS_TOKEN);
    
    const response = await client.get({
      path: 'themes',
    });

    res.json({ themes: response.body.themes });
  } catch (error) {
    console.error('Error fetching themes:', error);
    res.status(500).json({ error: 'Failed to fetch themes' });
  }
});

// Check app embed status
router.get('/api/shopify/app-status', async (req, res) => {
  try {
    const { shop } = req.query;
    const client = new Shopify.Clients.Rest(shop, process.env.SHOPIFY_ACCESS_TOKEN);
    
    const response = await client.get({
      path: 'app_installations/current',
    });

    res.json({ 
      isEnabled: response.body.app_installation.enabled_universal_embed 
    });
  } catch (error) {
    console.error('Error checking app status:', error);
    res.status(500).json({ error: 'Failed to check app status' });
  }
});

// Toggle app embed
router.post('/api/shopify/toggle-embed', async (req, res) => {
  try {
    const { shop, enabled, themeId } = req.body;
    const client = new Shopify.Clients.Rest(shop, process.env.SHOPIFY_ACCESS_TOKEN);
    
    await client.put({
      path: 'app_installations/preferences',
      data: {
        preferences: {
          app_embed: {
            enabled: enabled
          }
        }
      }
    });

    // If enabling, also add the app block to the theme
    if (enabled) {
      await client.put({
        path: `themes/${themeId}/assets`,
        data: {
          asset: {
            key: 'sections/app-embed.liquid',
            value: `{% schema %}
              {
                "name": "App Embed",
                "target": "section",
                "settings": []
              }
            {% endschema %}`
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