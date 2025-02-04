import { Shopify } from '@shopify/shopify-api';

export const verifyRequest = async (req, res, next) => {
  try {
    const session = await Shopify.Utils.loadCurrentSession(req, res);
    if (!session) {
      res.redirect(`/auth?shop=${req.query.shop}`);
      return;
    }
    
    // Check if session is valid
    if (new Date(session.expires) < new Date()) {
      res.redirect(`/auth?shop=${req.query.shop}`);
      return;
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}; 