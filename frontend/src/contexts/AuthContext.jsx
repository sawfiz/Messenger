import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  console.log(
    '🚀 ~ file: AuthContext.jsx:9 ~ AuthProvider ~ loading:',
    loading
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token
      const expirationTime = decodedToken.exp;
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken) {
        // Get the current time in seconds

        // Check if the token has expired
        if (expirationTime < currentTime) {
          console.log('Token has expired');
          logout();
        } else {
          console.log('Token is still valid');
          // Access user information from the decoded token payload
          setCurrentUser(decodedToken.user); // Set the user data from the decoded token
          setIsLoggedIn(true);
        }
      }
    }

    setLoading(false);
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setCurrentUser(user);
    setLoading(false);
  };

  const logout = () => {
    // Remove the 'token' from localStorage
    localStorage.removeItem('token');
    setCurrentUser(null);
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
