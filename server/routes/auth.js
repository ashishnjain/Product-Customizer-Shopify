import express from 'express';
import { Shopify } from '@shopify/shopify-api';

const router = express.Router();

router.get('/auth', async (req, res) => {
  try {
    const authRoute = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      '/auth/callback',
      true
    );
    res.redirect(authRoute);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).send(error.message);
  }
});

router.get('/auth/callback', async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(
      req,
      res,
      req.query
    );
    res.redirect(`/?host=${req.query.host}&shop=${session.shop}`);
  } catch (error) {
    console.error('Auth callback error:', error);
    res.status(500).send(error.message);
  }
});

export default router; 