import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/frontend/styles.css";

export { default as ProductCustomizer } from "./frontend/pages/products/FrontendPreviewModal";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
