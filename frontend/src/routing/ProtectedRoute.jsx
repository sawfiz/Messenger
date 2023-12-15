// Libraries
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Contexts
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { loading, isLoggedIn } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
