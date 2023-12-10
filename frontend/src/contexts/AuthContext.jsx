import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  console.log("🚀 ~ file: AuthContext.jsx:8 ~ AuthProvider ~ loading:", loading)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("🚀 ~ file: AuthContext.jsx:10 ~ AuthProvider ~ isLoggedIn:", isLoggedIn)
  const [currentUser, setCurrentUser] = useState('');
  console.log("🚀 ~ file: AuthContext.jsx:10 ~ AuthProvider ~ currentUser:", currentUser)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      if (decodedToken) {
        // Access user information from the decoded token payload
        setCurrentUser(decodedToken.user); // Set the user data from the decoded token
        setIsLoggedIn(true);
        setLoading(false);
      }
    }
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setLoading(false);
  };

  const logout = () => {
    // Remove the 'token' from localStorage
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const authContextValue = {
    loading,
    isLoggedIn,
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
