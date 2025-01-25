import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import '@shopify/polaris/build/esm/styles.css';

const root = document.getElementById('root');

// Get the shop from the URL
const shop = new URLSearchParams(window.location.search).get('shop');
const host = new URLSearchParams(window.location.search).get('host');

const config = {
  apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
  host: host,
  forceRedirect: true
};

ReactDOM.render(
  <BrowserRouter>
    <Provider config={config}>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </BrowserRouter>,
  root
);