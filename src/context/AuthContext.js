import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const DUMMY_USER = {
  username: 'tala',
  fullName: 'تالا جرادات',
  firstName: 'تالا',
  nationalId: '0123456789',
  country: 'الأردن',
  city: 'عمان',
  email: 'tala.jaradat@adalati.jo',
  phone: '+962790000000',
  memberSince: '٢٠٢٤',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback(async (username, password) => {
    // Simulated network delay
    await new Promise((r) => setTimeout(r, 600));
    const id = username?.trim().toLowerCase();
    if ((id === 'tala' || id === DUMMY_USER.nationalId) && password === 'tala') {
      setUser(DUMMY_USER);
      return { success: true };
    }
    const error = new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
