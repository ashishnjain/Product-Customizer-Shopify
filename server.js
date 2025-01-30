import express from 'express';
import { join } from 'path';
import { Shopify, ApiVersion } from '@shopify/shopify-api';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { shopifyApp } from '@shopify/shopify-app-express';
import { AppEmbed } from '@shopify/shopify-app-express/build/ts/app-embed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

// Middleware setup
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'build')));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Environment variables
const {
  SHOPIFY_API_KEY = '2a361ddbfb4088e709762a50906089bd',
  SHOPIFY_API_SECRET = '353ed8a8a99830e89a922576bbe4a14a',
  SCOPES = 'write_products,read_products,write_themes,read_themes,write_script_tags,read_script_tags',
  HOST = 'https://localhost:3000',
  BACKEND_URL = 'https://your-backend-url.com'
} = process.env;

// Initialize Shopify context
Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME: HOST.split('://')[0],
  API_VERSION: ApiVersion.January24,
  IS_EMBEDDED_APP: true,
});

// Initialize Shopify app
const shopify = shopifyApp({
  api: {
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    scopes: SCOPES.split(','),
    hostScheme: HOST.split('://')[0],
    hostName: HOST.replace(/https?:\/\//, ''),
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  },
});

// Initialize App Embed
const appEmbed = new AppEmbed({
  apiKey: SHOPIFY_API_KEY,
  secret: SHOPIFY_API_SECRET,
  type: 'theme',
  targets: {
    'theme-app-extension': {
      component: {
        path: '/blocks/app-block.liquid'
      },
      surface: 'theme-editor',
    }
  }
});

// Register the app embed with Shopify
shopify.registerAppEmbed(appEmbed);

// App Embed block route
app.get('/blocks/app-block.liquid', async (req, res) => {
  try {
    const session = await shopify.validateAppEmbedRequest(req, res);
    
    if (!session) {
      res.status(401).send('Unauthorized');
      return;
    }

    res.type('text/liquid');
    res.send(`
      {% schema %}
      {
        "name": "App Block",
        "target": "section",
        "stylesheet": "app-block.css",
        "javascript": "app-block.js",
        "settings": [
          {
            "type": "text",
            "id": "title",
            "label": "Block Title",
            "default": "App Block"
          }
        ]
      }
      {% endschema %}

      <div id="shopify-app-block" data-shop="{{ shop.permanent_domain }}">
        <div class="app-block-container">
          <h2>{{ block.settings.title }}</h2>
          <div id="app-block-content"></div>
        </div>
      </div>
    `);
  } catch (error) {
    console.error('Error serving app block:', error);
    res.status(500).send('Error serving app block');
  }
});

// Install script tag on app installation
async function installScriptTag(session) {
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);

  try {
    const response = await client.post({
      path: 'script_tags',
      data: {
        script_tag: {
          event: 'onload',
          src: `${BACKEND_URL}/customizer.js`
        },
      },
    });
    console.log('Script tag installed successfully:', response.body);
    return response;
  } catch (error) {
    console.error('Error installing script tag:', error);
    throw error;
  }
}

// App installation webhook
app.post('/api/webhooks/app/installed', async (req, res) => {
  try {
    const session = await shopify.validateAuthenticatedSession(req, res);
    await installScriptTag(session);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error in app installation webhook:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Auth endpoints
app.get('/api/auth', async (req, res) => {
  try {
    const authRoute = await shopify.auth.begin();
    res.redirect(authRoute);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send('Error during authentication');
  }
});

app.get('/api/auth/callback', async (req, res) => {
  try {
    const session = await shopify.auth.callback({
      rawRequest: req,
      rawResponse: res
    });

    // Setup app embedding for the shop
    await appEmbed.setup(session.shop, session.accessToken);

    // Redirect to app with host parameter
    const host = req.query.host;
    res.redirect(`/?host=${host}&shop=${session.shop}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send('Error during authentication callback');
  }
});

// Session middleware for API routes
app.use('/api/*', async (req, res, next) => {
  try {
    const session = await shopify.validateAuthenticatedSession(req, res);
    res.locals.shopify = { session };
    next();
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Auth verification endpoint
app.get('/api/auth/verify', async (req, res) => {
  try {
    const session = await shopify.validateAuthenticatedSession(req, res);
    res.status(200).json({ 
      authenticated: true, 
      shop: session.shop 
    });
  } catch (error) {
    res.status(401).json({ 
      authenticated: false, 
      error: error.message 
    });
  }
});

// Catch-all route for React app
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;