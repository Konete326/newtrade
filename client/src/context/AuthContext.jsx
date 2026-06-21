import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('td_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('td_access_token');
    if (token && user) {
      authService.me()
        .then((res) => {
          const userData = res.data.data;
          setUser(userData);
          localStorage.setItem('td_user', JSON.stringify(userData));
        })
        .catch(() => {
          localStorage.removeItem('td_access_token');
          localStorage.removeItem('td_refresh_token');
          localStorage.removeItem('td_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;
    localStorage.setItem('td_access_token', accessToken);
    localStorage.setItem('td_refresh_token', refreshToken);
    localStorage.setItem('td_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    try { await authService.logout(); } catch {}
    localStorage.removeItem('td_access_token');
    localStorage.removeItem('td_refresh_token');
    localStorage.removeItem('td_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
