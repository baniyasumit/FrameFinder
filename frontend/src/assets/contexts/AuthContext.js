import React, { createContext, useState, useContext } from 'react';


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
    return (
    <AuthContext.Provider value={{ showLogin, setShowLogin, showRegister, setShowRegister }}>
      {children}
    </AuthContext.Provider>
  );
};
