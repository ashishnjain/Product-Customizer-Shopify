import express from 'express';
import { join } from 'path';
import { Shopify, ApiVersion } from '@shopify/shopify-api';
import cookieParser from 'cookie-parser';
import { verifyRequest } from './middleware/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppInstallations } from './app_installations.js';
import shopifyRoutes from './server/routes/shopify.js';
import { shopifyApp } from '@shopify/shopify-app-express';
import { AppEmbed } from '@shopify/shopify-app-express/build/ts/app-embed';

dotenv.config();
const app = express();
const PORT = process.env.BACKEND_PORT || 8081;

// Enable CORS
app.use(cors());
app.use(express.json());

// Add headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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

// Initialize Shopify app
const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: [
    'read_products',
    'write_products',
    'read_themes',
    'write_themes',
    'read_script_tags',
    'write_script_tags'
  ],
  hostName: process.env.HOST.replace(/https?:\/\//, ''),
  isEmbeddedApp: true,
  apiVersion: '2024-01'
});

// App Embed Configuration
const appEmbed = new AppEmbed({
  targets: {
    productCustomizer: {
      path: '/apps/product-customizer/embed',
      surface: 'product'
    }
  }
});

// Register the app embed
shopify.registerAppEmbed(appEmbed);

// Route to handle app embed content
app.get('/apps/product-customizer/embed', async (req, res) => {
  const session = await shopify.validateAppEmbedRequest(req, res);
  
  if (!session) {
    res.status(401).send('Unauthorized');
    return;
  }

  // Render your app embed content
  res.send(`
    <div id="product-customizer-root">
      <h2>Product Customizer</h2>
      <!-- Your app content will be mounted here -->
    </div>
  `);
});

// Install script tag on app installation
async function installScriptTag(session) {
  const client = new shopify.api.clients.Rest(session);
  
  try {
    await client.post({
      path: 'script_tags',
      data: {
        script_tag: {
          event: 'onload',
          src: `${process.env.BACKEND_URL}/customizer.js`
        },
      },
    });
  } catch (error) {
    console.error('Error installing script tag:', error);
  }
}

// App installation webhook
app.post('/webhooks/app/installed', async (req, res) => {
  const session = await shopify.validateAuthenticatedSession(req, res);
  
  try {
    await installScriptTag(session);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in app installation webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

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

// Add Shopify routes
app.use('/', shopifyRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something broke!' });
}); 