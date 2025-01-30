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
const { 
  SHOPIFY_API_KEY, 
  SHOPIFY_API_SECRET, 
  SHOPIFY_SHOP_NAME,
  SHOPIFY_ACCESS_TOKEN 
} = process.env;

// Add this middleware to attach shop info to all requests
app.use((req, res, next) => {
  req.shopify = {
    shop: SHOPIFY_SHOP_NAME,
    accessToken: SHOPIFY_ACCESS_TOKEN
  };
  next();
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