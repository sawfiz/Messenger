import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');

  const login = (name) => {
    setIsLoggedIn(true);
    setName(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setName('');
  };

  const authContextValue = {
    isLoggedIn,
    name,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
