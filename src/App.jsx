import React from 'react';
import { NavigationMenu } from '@shopify/app-bridge-react';
import Routes from './routes';
import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components/providers";

export default function App() {
  return (
    <PolarisProvider>
      <AppBridgeProvider>
        <QueryProvider>
          <NavigationMenu
            navigationLinks={[
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
              },
            ]}
          />
          <Routes />
        </QueryProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
}