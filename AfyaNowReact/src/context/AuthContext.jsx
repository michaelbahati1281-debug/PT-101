import { createContext, useContext, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    async login(credentials) { const data = await authService.login(credentials); if (data?.accessToken) localStorage.setItem("afyanowAccessToken", data.accessToken); setUser(data?.user ?? null); return data; },
    async register(details) { const data = await authService.register(details); setUser(data?.user ?? null); return data; },
    async logout() { try { await authService.logout(); } finally { localStorage.removeItem("afyanowAccessToken"); setUser(null); } },
  }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error("useAuth must be used within AuthProvider"); return context; }
