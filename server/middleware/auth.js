import { Shopify } from '@shopify/shopify-api';
import { shopifyConfig } from '../config/shopify.js';

// Initialize Shopify
const shopify = new Shopify({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: shopifyConfig.scopes,
  hostName: process.env.SHOPIFY_APP_URL,
  apiVersion: '2024-01',
  isEmbeddedApp: true
});

export const authenticateShopify = async (req, res, next) => {
  try {
    // Get shop from query or session
    const shop = req.query.shop || req.session.shop;
    
    if (!shop) {
      res.status(401).json({ error: 'No shop provided' });
      return;
    }

    // Check if we have a session
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    
    if (!session) {
      // Generate auth URL
      const authRoute = await Shopify.Auth.beginAuth(
        req,
        res,
        shop,
        '/auth/callback',
        true
      );
      res.redirect(authRoute);
      return;
    }

    // Verify session is valid
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    await client.get({ path: 'shop' }); // Verify token is still valid

    // Add session to request for later use
    req.shopifySession = session;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

// Helper to verify webhook requests
export const verifyWebhook = async (req, res, next) => {
  try {
    const hmac = req.headers['x-shopify-hmac-sha256'];
    const topic = req.headers['x-shopify-topic'];
    const shop = req.headers['x-shopify-shop-domain'];

    if (!hmac || !topic || !shop) {
      res.status(401).json({ error: 'Missing required headers' });
      return;
    }

    const verified = await Shopify.Utils.verifyWebhook(
      req.body,
      hmac,
      process.env.SHOPIFY_API_SECRET
    );

    if (!verified) {
      res.status(401).json({ error: 'Invalid webhook signature' });
      return;
    }

    req.webhook = { topic, shop };
    next();
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(401).json({ error: 'Webhook verification failed' });
  }
}; 