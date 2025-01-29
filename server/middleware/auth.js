import { Shopify } from '@shopify/shopify-api';

export async function verifyRequest(req, res, next) {
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  
  if (!session || !session.accessToken) {
    res.redirect(`/auth?shop=${req.query.shop}`);
    return;
  }

  next();
} 