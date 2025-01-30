import express from 'express';
import { join } from 'path';
import { Shopify } from '@shopify/shopify-api';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { AppEmbed } from '@shopify/shopify-api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Shopify configuration
const { 
  SHOPIFY_API_KEY, 
  SHOPIFY_API_SECRET, 
  SHOPIFY_SHOP_NAME,
  SHOPIFY_ACCESS_TOKEN 
} = process.env;

// Initialize Shopify API client
const shopify = new Shopify({
  apiKey: SHOPIFY_API_KEY,
  apiSecretKey: SHOPIFY_API_SECRET,
  scopes: ['read_products', 'write_products'], // Add required scopes
  hostName: process.env.HOST || 'localhost:3000',
});

// Initialize AppEmbed
const appEmbed = new AppEmbed({
  apiKey: SHOPIFY_API_KEY,
  secret: SHOPIFY_API_SECRET,
  targets: {
    admin: {
      component: {
        path: '/blocks/app-block.liquid',
        render: async (context) => {
          return {
            props: {
              // Add your component props here
              shopName: SHOPIFY_SHOP_NAME,
            }
          };
        }
      }
    }
  }
});

// App embedding handler
async function handleAppEmbed(shop, accessToken) {
  try {
    const client = new Shopify.Clients.Rest(shop, accessToken);
    
    await client.post({
      path: 'app/embeddings',
      data: {
        embedding: {
          handle: 'app-block',
          settings: {
            type: 'admin',
            target: 'section'
          }
        }
      }
    });
  } catch (error) {
    console.error('Error enabling app embed:', error);
    throw error;
  }
}

// Add this middleware to attach shop info to all requests
app.use((req, res, next) => {
  req.shopify = {
    shop: SHOPIFY_SHOP_NAME,
    accessToken: SHOPIFY_ACCESS_TOKEN
  };
  next();
});

// App block route
app.get('/blocks/app-block.liquid', async (req, res) => {
  try {
    const session = await shopify.validateAppEmbedRequest(req, res);
    
    if (!session) {
      res.status(401).send('Unauthorized');
      return;
    }

    const template = `
      {% schema %}
      {
        "name": "Product Customizer",
        "target": "section",
        "settings": []
      }
      {% endschema %}

      <div id="product-customizer-container">
        <div class="customizer-wrapper">
          {{ content_for_index }}
        </div>
      </div>
    `;

    res.type('liquid').send(template);
  } catch (error) {
    console.error('Error serving app block:', error);
    res.status(500).send('Error loading app block');
  }
});

// Auth callback route
app.get('/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );
    
    // Enable app embedding after successful auth
    await handleAppEmbed(session.shop, session.accessToken);
    
    // Store session
    await shopify.session.storeSession(session);
    
    res.redirect(`/?host=${req.query.host}&shop=${session.shop}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred during authentication');
  }
});

// Routes
import shopifyRoutes from './server/routes/shopify.js';
app.use('/', shopifyRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});