import express from 'express';
import { join } from 'path';
import { Shopify } from '@shopify/shopify-api';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

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

// Routes
import shopifyRoutes from './server/routes/shopify.js';
app.use('/api/shopify', shopifyRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});