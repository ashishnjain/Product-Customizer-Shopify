import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Provider } from "@shopify/app-bridge-react";

export function AppBridgeProvider({ children }) {
  const location = useLocation();
  const history = useMemo(() => ({
    replace: (path) => {
      window.location.href = path;
    },
  }), []);

  const config = {
    apiKey: process.env.REACT_APP_SHOPIFY_API_KEY,
    host: new URLSearchParams(location.search).get("host"),
    forceRedirect: true,
  };

  return (
    <Provider config={config} router={{ history }}>
      {children}
    </Provider>
  );
} 