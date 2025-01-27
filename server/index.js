import express from 'express';
import shopifyRoutes from './routes/shopify.js';

const app = express();

// Add these middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register the shopify routes
app.use('/', shopifyRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
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