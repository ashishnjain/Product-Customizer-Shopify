export const SHOPIFY_APP_NAVIGATION = {
  items: [
    {
      label: 'Option Sets',
      destination: '/option-sets',
      icon: 'ListMajor'
    },
    {
      label: 'Templates',
      destination: '/templates',
      icon: 'TemplateMajor'
    },
    {
      label: 'Settings',
      destination: '/settings',
      icon: 'SettingsMajor'
    },
    {
      label: 'Automations',
      destination: '/automations',
      icon: 'AutomationMajor'
    },
    {
      label: 'Pricing',
      destination: '/pricing',
      icon: 'CreditCardMajor'
    },
    {
      label: 'Contact Us',
      destination: '/contact',
      icon: 'EmailMajor'
    }
  ]
};

export const shopifyConfig = {
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecret: process.env.SHOPIFY_API_SECRET,
  scopes: [
    'read_products',
    'write_products',
    'read_themes',
    'write_themes',
    'read_script_tags',
    'write_script_tags'
  ],
  hostName: process.env.SHOPIFY_APP_URL,
  apiVersion: '2024-01',
  isEmbeddedApp: true
}; 