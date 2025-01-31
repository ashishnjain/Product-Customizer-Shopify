import React from 'react';
import { NavigationMenu } from '@shopify/app-bridge-react';
import Routes from './routes';
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components/providers";
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react';
import { useNavigate } from 'react-router-dom';
import { SHOPIFY_APP_NAVIGATION } from './config/shopify';

export default function App() {
  const navigate = useNavigate();
  
  // Get URL params
  const queryParams = new URLSearchParams(window.location.search);
  const host = queryParams.get('host');
  const shop = queryParams.get('shop');

  // Add error handling for missing params
  if (!host || !shop) {
    console.error('Missing required parameters: host or shop');
    return <div>Error: Missing required parameters</div>;
  }

  const config = {
    apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
    host: host,
    forceRedirect: true,
    shopOrigin: shop
  };

  // Add error handling for missing API key
  if (!config.apiKey) {
    console.error('Missing REACT_APP_SHOPIFY_API_KEY environment variable');
    return <div>Error: Missing API key configuration</div>;
  }

  return (
    <PolarisProvider>
      <AppBridgeProvider config={config}>
        <QueryProvider>
          <NavigationMenu
            navigationLinks={SHOPIFY_APP_NAVIGATION.items}
          />
          <Routes />
        </QueryProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}