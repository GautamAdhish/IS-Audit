import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

export type User = any;
type AuthContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; logout: () => void; refresh: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const token = localStorage.getItem('is_audit_token');
    if (!token) { setUser(null); return; }
    try { const res = await api.get<{ user: User }>('/auth/me'); setUser(res.data.user); }
    catch { localStorage.removeItem('is_audit_token'); setUser(null); }
  };

  useEffect(() => {
    refresh().finally(() => setLoading(false));
    const onExpired = () => { localStorage.removeItem('is_audit_token'); setUser(null); };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const value = useMemo(() => ({
    user, loading,
    login: async (email: string, password: string) => {
      const res = await api.post<{ user: User }>('/auth/login', { email, password });
      const token = (res as any).token;
      if (!token) throw new Error('Authentication token was not returned by the server.');
      localStorage.setItem('is_audit_token', token);
      setUser((res as any).data.user);
    },
    logout: () => { localStorage.removeItem('is_audit_token'); setUser(null); },
    refresh,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used inside AuthProvider'); return ctx; }
