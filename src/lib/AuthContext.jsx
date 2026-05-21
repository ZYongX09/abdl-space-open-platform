import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getUserInfo, refreshAccessToken, login as oauthLogin, logout as oauthLogout, handleCallback as oauthHandleCallback } from './auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const u = await getUserInfo();
      if (u) {
        setUser(u);
      } else {
        // token 可能过期，尝试刷新
        try {
          await refreshAccessToken();
          const u2 = await getUserInfo();
          setUser(u2);
        } catch {
          // 刷新也失败，清除 token
          setUser(null);
        }
      }
    } catch (err) {
      console.error('[Auth] restoreSession error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) {
      restoreSession();
    } else {
      setLoading(false);
    }
  }, [restoreSession]);

  const login = useCallback((currentPath) => oauthLogin(currentPath), []);
  const logout = useCallback(() => { oauthLogout(); setUser(null); }, []);
  const handleCallback = useCallback(async (code) => {
    await oauthHandleCallback(code);
    const u = await getUserInfo();
    setUser(u);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, handleCallback }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
