import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Options from './components/Options';
import OptionSets from './components/OptionSets';
import NewOptionSet from './components/NewOptionSet';
import ThemeSetup from './components/Theme/ThemeSetup';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin">
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="options" element={<Options />} />
        <Route path="option-sets" element={<OptionSets />} />
        <Route path="option-sets/new" element={<NewOptionSet />} />
        <Route path="theme" element={<ThemeSetup />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

// Auth check component
const RequireAuth = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('shopify_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AppRoutes; 