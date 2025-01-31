import express from 'express';
import shopifyRoutes from './routes/shopify.js';

const app = express();

// Add security headers including Content-Security-Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors https://admin.shopify.com/store/quick-start-b5afd779/apps/customisationapp-1;"
  );
  next();
});

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy - required for Shopify
app.set('trust proxy', 1);

// Register the shopify routes
app.use('/', shopifyRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Handle 404s
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Add error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something broke!',
    error: err.message 
  });
});

export default app;