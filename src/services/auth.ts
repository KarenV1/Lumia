/**
 * Capa de autenticación de Lumia.
 *
 * La UI depende únicamente de la interfaz `AuthService`. El punto de integración
 * es la última línea: cambia `mockAuthService` por `supabaseAuthService` cuando
 * tengas las variables de entorno configuradas, o deja que el selector automático
 * lo haga si `VITE_SUPABASE_URL` está definida.
 */

import { supabase, hasSupabase } from '../lib/supabase.ts';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface AuthService {
  getSession(): Promise<AuthUser | null>;
  signInWithPassword(email: string, password: string): Promise<AuthResult>;
  signUp(params: SignUpParams): Promise<AuthResult>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<{ error: string | null }>;
  /** Suscripción a cambios de sesión (token refresh, confirmación de email, etc.) */
  subscribe?: (callback: (user: AuthUser | null) => void) => () => void;
}

/* ── Mock (localStorage) ──────────────────────────────────────── */

const SESSION_KEY = 'lumia_session';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : String(Date.now());

const readSession = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
};

const writeSession = (user: AuthUser | null) => {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
};

export const mockAuthService: AuthService = {
  async getSession() {
    await wait(150);
    return readSession();
  },
  async signInWithPassword(email, password) {
    await wait(650);
    if (!email || !password) return { user: null, error: 'Introduce tu correo y contraseña.' };
    if (!isEmail(email)) return { user: null, error: 'El correo no parece válido.' };
    const user: AuthUser = { id: newId(), email };
    writeSession(user);
    return { user, error: null };
  },
  async signUp({ name, email, password }) {
    await wait(750);
    if (!name || !email || !password) return { user: null, error: 'Completa todos los campos.' };
    if (!isEmail(email)) return { user: null, error: 'El correo no parece válido.' };
    if (password.length < 6)
      return { user: null, error: 'La contraseña debe tener al menos 6 caracteres.' };
    const user: AuthUser = { id: newId(), email, name };
    writeSession(user);
    return { user, error: null };
  },
  async signOut() {
    await wait(150);
    writeSession(null);
  },
  async resetPassword(email) {
    await wait(500);
    if (!email || !isEmail(email)) return { error: 'Introduce un correo válido.' };
    return { error: null };
  },
};

/* ── Supabase ─────────────────────────────────────────────────── */

const toAuthUser = (u: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser => ({
  id: u.id,
  email: u.email ?? '',
  name: u.user_metadata?.name as string | undefined,
});

export const supabaseAuthService: AuthService = {
  async getSession() {
    const { data } = await supabase.auth.getSession();
    const u = data.session?.user;
    return u ? toAuthUser(u) : null;
  },
  async signInWithPassword(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    return { user: toAuthUser(data.user), error: null };
  },
  async signUp({ name, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: 'No se pudo crear la cuenta.' };
    return { user: toAuthUser(data.user), error: null };
  },
  async signOut() {
    await supabase.auth.signOut();
  },
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error: error?.message ?? null };
  },
  subscribe(callback) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user ? toAuthUser(session.user) : null);
    });
    return () => subscription.unsubscribe();
  },
};

/* ── Punto de integración ─────────────────────────────────────── */

export const authService: AuthService = hasSupabase ? supabaseAuthService : mockAuthService;
