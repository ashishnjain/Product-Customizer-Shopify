import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/frontend/styles.css";
import { AppProvider } from '@shopify/app-bridge-react';

export { default as ProductCustomizer } from "./frontend/pages/products/FrontendPreviewModal";

const root = ReactDOM.createRoot(document.getElementById("root"));

const config = {
  apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
  host: new URL(window.location).searchParams.get("host"),
  forceRedirect: true
};

root.render(
  <React.StrictMode>
    <AppProvider config={config}>
      <App />
    </AppProvider>
  </React.StrictMode>
);
