import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, userApi } from '../api/authApi';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techvault_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('techvault_token'));
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadProfile = async () => {
      if (token) {
        try {
          const res = await userApi.getProfile();
          const profile = res?.data || res;
          if (profile && profile.email) {
            setUser(profile);
            localStorage.setItem('techvault_user', JSON.stringify(profile));
          }
        } catch (err) {
          console.warn('Session verification note:', err?.message || err);
        }
      }
    };
    loadProfile();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      const authData = res?.data || res;
      if (authData && authData.token) {
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('techvault_token', authData.token);
        localStorage.setItem('techvault_user', JSON.stringify(authData));
        addToast(`Welcome back, ${authData.fullName || authData.name || 'Customer'}!`, 'success');
        return { success: true, user: authData };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const msg = err?.message || 'Invalid credentials';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await authApi.register(formData);
      const authData = res?.data || res;
      if (authData && authData.token) {
        setToken(authData.token);
        setUser(authData);
        localStorage.setItem('techvault_token', authData.token);
        localStorage.setItem('techvault_user', JSON.stringify(authData));
        addToast('Registration successful! Welcome to TechVault.', 'success');
        return { success: true, user: authData };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const msg = err?.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = (showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('techvault_token');
    localStorage.removeItem('techvault_user');
    if (showToast) addToast('You have been logged out.', 'info');
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('techvault_user', JSON.stringify(next));
      return next;
    });
  };

  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.role === 'ROLE_ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
