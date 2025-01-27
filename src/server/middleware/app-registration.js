import { shopifyApp } from '@shopify/shopify-app-express';

const shopify = shopifyApp({
  // ... your existing config ...
  navigation: {
    // Primary navigation
    primary: {
      items: [
        {
          label: 'Option Sets',
          destination: '/option-sets',
        },
        {
          label: 'Templates',
          destination: '/templates',
        },
        {
          label: 'Settings',
          destination: '/settings',
        },
        {
          label: 'Automations',
          destination: '/automations',
        },
        {
          label: 'Pricing',
          destination: '/pricing',
        },
        {
          label: 'Contact Us',
          destination: '/contact',
        }
      ],
    },
  },
  // App embedding configuration
  appDirectories: {
    app: path.join(__dirname, '..', 'frontend'),
  },
  isEmbeddedApp: true,
  // Add these to ensure proper embedding
  hooks: {
    afterAuth: async (ctx) => {
      const { shop, accessToken } = ctx.state.shopify;
      
      // Register app navigation
      await registerAppNavigation(shop, accessToken);
      
      // Enable app embedding
      await enableAppEmbedding(shop, accessToken);
    },
  },
});

// Function to register app navigation
async function registerAppNavigation(shop, accessToken) {
  const client = new Shopify.Clients.Rest(shop, accessToken);
  
  await client.put({
    path: 'app/navigation',
    data: SHOPIFY_APP_NAVIGATION
  });
}

// Function to enable app embedding
async function enableAppEmbedding(shop, accessToken) {
  const client = new Shopify.Clients.Rest(shop, accessToken);
  
  await client.put({
    path: 'app/settings',
    data: {
      embedded: true
    }
  });
}

export default shopify; 