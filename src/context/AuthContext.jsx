import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const SESSION_KEY = 'cms_auth_user';
const API_BASE = 'https://cms-backend-e2nw.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Invalid credentials');
      }

      const data = await response.json(); // { token, user, role }
      
      // Ensure the user object has the role correctly formatted for frontend state
      const userWithRole = { 
        ...data.user, 
        token: data.token, 
        role: data.role.toLowerCase() 
      };

      localStorage.setItem(SESSION_KEY, JSON.stringify(userWithRole));
      setUser(userWithRole);
      return { success: true, user: userWithRole };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password, institution }) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, institution }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Registration failed');
      }

      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isStudent: user?.role === 'student',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
