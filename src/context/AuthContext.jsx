import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);
const SESSION_KEY = 'cms_auth_user';

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
      // Search admin users first
      const adminRes = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}`);
      if (!adminRes.ok) throw new Error('Cannot connect to server. Is the JSON server running?');
      const admins = await adminRes.json();
      const adminMatch = admins.find(u => u.email === email && u.password === password);

      if (adminMatch) {
        const { password: _p, ...safeUser } = adminMatch;
        const userWithRole = { ...safeUser, role: 'admin' };
        localStorage.setItem(SESSION_KEY, JSON.stringify(userWithRole));
        setUser(userWithRole);
        return { success: true, user: userWithRole };
      }

      // Search students
      const stuRes = await fetch(`http://localhost:5000/students?email=${encodeURIComponent(email)}`);
      const students = await stuRes.json();
      const studentMatch = students.find(s => s.email === email && s.password === password);

      if (studentMatch) {
        const { password: _p, ...safeUser } = studentMatch;
        const userWithRole = { ...safeUser, role: 'student' };
        localStorage.setItem(SESSION_KEY, JSON.stringify(userWithRole));
        setUser(userWithRole);
        return { success: true, user: userWithRole };
      }

      throw new Error('Invalid email or password');
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ name, email, password, institution }) => {
    setLoading(true);
    try {
      const checkRes = await fetch(`http://localhost:5000/users?email=${encodeURIComponent(email)}`);
      const existing = await checkRes.json();
      if (existing.length > 0) throw new Error('An account with this email already exists');
      const newUser = { name, email, password, institution, role: 'admin', createdAt: new Date().toISOString() };
      const createRes = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!createRes.ok) throw new Error('Failed to create account');
      return { success: true };
    } catch (err) {
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
