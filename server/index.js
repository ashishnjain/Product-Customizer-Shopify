import express from 'express';
import { Shopify } from '@shopify/shopify-api';
import shopifyRoutes from './routes/shopify.js';
import authRoutes from './routes/auth.js';
import { corsMiddleware, securityHeaders } from './middleware/cors.js';
import { verifyRequest } from './middleware/auth.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware());
app.use(securityHeaders());

// Auth routes (no verification needed)
app.use('/', authRoutes);

// Protected routes
app.use('/api', verifyRequest, shopifyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something broke!',
    error: err.message 
  });
});

export default app; 