import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');

  const login = (name, id) => {
    setIsLoggedIn(true);
    setName(name);
    setUserId(id);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setName('');
  };

  const authContextValue = {
    isLoggedIn,
    name,
    userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
