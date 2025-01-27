import { Shopify } from '@shopify/shopify-api';

export const AppInstallations = {
  includes: async function (shopDomain) {
    const shopify = new Shopify.Clients.Rest(shopDomain);
    
    try {
      await shopify.get({
        path: 'app_installations',
      });
      return true;
    } catch (error) {
      return false;
    }
  },

  register: async function (shopDomain, accessToken) {
    const client = new Shopify.Clients.Rest(shopDomain, accessToken);
    
    await client.put({
      path: 'app_installations',
      data: {
        app_installation: {
          application_id: process.env.SHOPIFY_API_KEY,
          embedded: true
        }
      }
    });
  }
}; 