import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products/:id" element={<ProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
