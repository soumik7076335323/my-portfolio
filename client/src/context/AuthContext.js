import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

const TOKEN_KEY = 'sa_admin_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch (e) {
      return null;
    }
  });
  const [admin, setAdmin] = useState(null);
  const [checking, setChecking] = useState(Boolean(token));

  // Validate the stored token on boot
  useEffect(() => {
    let alive = true;
    if (!token) {
      setChecking(false);
      return undefined;
    }
    authAPI
      .me(token)
      .then((res) => {
        if (alive) setAdmin(res.data.data);
      })
      .catch(() => {
        if (alive) {
          try {
            localStorage.removeItem(TOKEN_KEY);
          } catch (e) {
            /* ignore */
          }
          setToken(null);
          setAdmin(null);
        }
      })
      .finally(() => {
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    const { token: newToken, admin: adminUser } = res.data;
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
    } catch (e) {
      /* ignore */
    }
    setToken(newToken);
    setAdmin(adminUser);
    return adminUser;
  };

  const logout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      /* ignore */
    }
    setToken(null);
    setAdmin(null);
  };

  const updateAdminName = (name) => setAdmin((a) => (a ? { ...a, name } : a));

  return (
    <AuthContext.Provider value={{ token, admin, checking, login, logout, updateAdminName }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
