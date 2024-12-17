import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';

import { AuthContext } from './authContext';

const ProtectedRoute = ({ element: Component, role, ...rest }) => {
  const { user } = useContext(AuthContext);

  if (!user?.data[0]?.UserID) {
    // If user is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // If user role does not match, redirect to 404 or some other page
    return <Navigate to="/404" replace />;
  }

  return <Route {...rest} element={Component} />;
};

export default ProtectedRoute;