import React from 'react';
import { Navigate } from 'react-router-dom';
import ThemeSetup from './components/Theme/ThemeSetup';
import AdminLayout from './layouts/AdminLayout';

const routes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'theme',
        element: (
          <RequireAuth>
            <ThemeSetup />
          </RequireAuth>
        )
      },
      // ... other routes ...
      {
        path: '*',
        element: <Navigate to="/admin/dashboard" replace />
      }
    ]
  }
];

// Auth check component
const RequireAuth = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem('shopify_token');
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default routes; 