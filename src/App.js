import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './admin/pages/AdminDashboard';
import ProductPage from './frontend/pages/products/ProductPage';
import "./assets/admin/customizer.css";
import "./assets/admin/dashboard.css";
import "./assets/admin/elementEditModal.css";
import "./assets/admin/elementPreview.css";
import "./assets/admin/elementSelectionModal.css";
import "./assets/admin/newOptionSet.css";
import "./assets/frontend/styles.css";
import "./assets/admin/frontendPreview.css";
import "./assets/frontend/customization.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h1>Product Customizer</h1>
        {/* Add your app components here */}
      </div>
    </BrowserRouter>
  );
}

export default App;
