import React, { createContext, useContext, useState } from "react";

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null); // Manage user state
  const [mobileSelectedUser, setMobileSelectedUser] = useState(null); // Manage user state
  // const [user, setUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null); // Manage user state
  const [user, setUser] = useState(null); // Manage user state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    selectedUser,
    setSelectedUser,
    user,
    setUser,
    isAuthenticated,
    login,
    logout,
    darkTheme,
    setDarkTheme,
    mobileSelectedUser,
    setMobileSelectedUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
