import express from 'express';
import { join } from 'path';
import { Shopify, ApiVersion } from '@shopify/shopify-api';
import cookieParser from 'cookie-parser';
import { verifyRequest } from './middleware/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppInstallations } from './app_installations.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(join(__dirname, 'build')));

// Initialize Shopify context
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY || '2a361ddbfb4088e709762a50906089bd',
  API_SECRET_KEY: SHOPIFY_API_SECRET || '353ed8a8a99830e89a922576bbe4a14a',
  SCOPES: SCOPES || 'write_products,read_products,write_themes,read_themes,write_script_tags,read_script_tags',
  HOST_NAME: HOST?.replace(/https?:\/\//, '') || 'localhost:3000',
  HOST_SCHEME: HOST?.split('://')[0] || 'https',
  API_VERSION: ApiVersion.January24,
  IS_EMBEDDED_APP: true,
});

// Add this after Shopify.Context.initialize
const handleAppEmbed = async (shop, accessToken) => {
  const client = new Shopify.Clients.Rest(shop, accessToken);
  
  try {
    await client.put({
      path: 'app_installations/preferences',
      data: {
        preferences: {
          app_embed: {
            enabled: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error enabling app embed:', error);
  }
};

// Auth routes
app.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  if (!shop) {
    return res.status(400).send('Missing shop parameter');
  }

  const authRoute = await Shopify.Auth.beginAuth(
    req,
    res,
    shop,
    '/auth/callback',
    true,
  );
  return res.redirect(authRoute);
});

app.get('/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );
    
    // Enable app embedding after successful auth
    await handleAppEmbed(session.shop, session.accessToken);
    
    res.redirect(`/?host=${req.query.host}&shop=${session.shop}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred during authentication');
  }
});

// Protected routes
app.use('/api/*', verifyRequest);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}); 