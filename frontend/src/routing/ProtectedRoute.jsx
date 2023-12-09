// Libraries
import React, { useContext, useState, useEffect} from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Contexts
import { AuthContext } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const {loading, isLoggedIn } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};
