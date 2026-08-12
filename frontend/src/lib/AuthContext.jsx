import React, { createContext, useContext, useState } from "react";
import { getToken, setToken, clearAuthStorage } from "@/lib/apiClient";

const AuthContext = createContext();

function isUsableToken(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.role === "admin" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function getSavedUser() {
  try {
    const saved = localStorage.getItem("pos_auth_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    localStorage.removeItem("pos_auth_user");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const valid = isUsableToken(getToken());
    if (!valid) clearAuthStorage();
    return valid;
  });
  const [user, setUser] = useState(getSavedUser);

  const login = (token, userData) => {
    setToken(token);
    localStorage.setItem("pos_auth_user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
    setIsAuthenticated(false);
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
