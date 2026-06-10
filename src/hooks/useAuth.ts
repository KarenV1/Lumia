import { useCallback, useEffect, useState } from 'react';
import { authService, AuthUser, SignUpParams } from '../services/auth.ts';

/**
 * Estado y acciones de autenticación. Apoyado en `authService`, así que la UI
 * no sabe (ni le importa) si detrás hay un mock o Supabase.
 */
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
    return () => {
      active = false;
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
