import express from 'express';
import { join } from 'path';
import { Shopify } from '@shopify/shopify-api';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { shopifyApp } from '@shopify/shopify-app-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Shopify configuration
const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY,
  API_SECRET_KEY: SHOPIFY_API_SECRET,
  SCOPES: SCOPES.split(','),
  HOST_NAME: HOST.replace(/https?:\/\//, ''),
  HOST_SCHEME: HOST.split('://')[0],
  IS_EMBEDDED_APP: true,
  API_VERSION: '2024-01'
});

// Authentication middleware
const shopify = shopifyApp({
  api: {
    apiKey: SHOPIFY_API_KEY,
    apiSecretKey: SHOPIFY_API_SECRET,
    scopes: SCOPES.split(','),
    hostName: HOST.replace(/https?:\/\//, ''),
    hostScheme: HOST.split('://')[0],
    isEmbeddedApp: true,
    apiVersion: '2024-01'
  },
  auth: {
    path: '/api/auth',
    callbackPath: '/api/auth/callback',
  },
  webhooks: {
    path: '/api/webhooks',
  }
});

// Add Shopify authentication middleware
app.use(shopify.auth.begin());
app.use(shopify.auth.callback());
app.use(shopify.validateAuthenticatedSession());

// Routes
import shopifyRoutes from './server/routes/shopify.js';
app.use('/api/shopify', shopifyRoutes);

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