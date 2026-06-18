import { useCallback, useEffect, useState } from 'react';
import { authService, AuthUser, SignUpParams } from '../services/auth.ts';

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    authService.getSession().then((session) => {
      if (!active) return;
      setUser(session);
      setReady(true);
    });

    // Supabase: reaccionar a cambios de sesión (token refresh, confirmación de email…)
    const unsub = authService.subscribe?.((u) => {
      if (!active) return;
      setUser(u);
      setReady(true);
    });

    return () => {
      active = false;
      unsub?.();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    const { user: u, error: e } = await authService.signInWithPassword(email, password);
    if (e) setError(e);
    else setUser(u);
    setLoading(false);
    return !e;
  }, []);

  const signUp = useCallback(async (params: SignUpParams) => {
    setLoading(true);
    setError(null);
    const { user: u, error: e } = await authService.signUp(params);
    if (e) setError(e);
    else setUser(u);
    setLoading(false);
    return !e;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    const { error: e } = await authService.resetPassword(email);
    if (e) setError(e);
    setLoading(false);
    return !e;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { user, loading, error, ready, signIn, signUp, signOut, resetPassword, clearError };
};
