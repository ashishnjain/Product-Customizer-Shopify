import cors from 'cors';

export const corsMiddleware = () => {
  return cors({
    origin: [process.env.APP_URL, 'https://admin.shopify.com'],
    credentials: true
  });
};

export const securityHeaders = () => {
  return (req, res, next) => {
    res.setHeader('Content-Security-Policy', `frame-ancestors https://*.myshopify.com https://admin.shopify.com;`);
    next();
  };
}; 