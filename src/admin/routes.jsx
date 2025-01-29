import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Options from './components/Options';
import OptionSets from './components/OptionSets';
import NewOptionSet from './components/NewOptionSet';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/options" element={<Options />} />
      <Route path="/option-sets" element={<OptionSets />} />
      <Route path="/new-option-set" element={<NewOptionSet />} />
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