import express from 'express';
const router = express.Router();

// Option Sets route
router.get('/option-sets', (req, res) => {
  res.render('option-sets');
});

// Templates route
router.get('/templates', (req, res) => {
  res.render('templates');
});

// Settings route
router.get('/settings', (req, res) => {
  res.render('settings');
});

// Automations route
router.get('/automations', (req, res) => {
  res.render('automations');
});

// Pricing route
router.get('/pricing', (req, res) => {
  res.render('pricing');
});

// Contact route
router.get('/contact', (req, res) => {
  res.render('contact');
});

export default router; 