import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isAuthenticated, getUserInfo, login as oauthLogin, logout as oauthLogout, handleCallback as oauthHandleCallback } from './auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      getUserInfo().then(u => {
        setUser(u);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

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
