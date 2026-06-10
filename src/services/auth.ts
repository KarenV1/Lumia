/**
 * Capa de autenticación de Lumia.
 *
 * Hoy usa una implementación simulada (mock) con localStorage para construir y
 * probar la interfaz. La lógica de la app depende SOLO de la interfaz
 * `AuthService`, así que migrar a Supabase Authentication más adelante es
 * cambiar la implementación exportada como `authService` — sin tocar la UI.
 *
 * Ejemplo de migración futura (Supabase):
 *
 *   import { createClient } from '@supabase/supabase-js';
 *   const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
 *
 *   export const supabaseAuthService: AuthService = {
 *     async getSession() {
 *       const { data } = await supabase.auth.getSession();
 *       const u = data.session?.user;
 *       return u ? { id: u.id, email: u.email!, name: u.user_metadata?.name } : null;
 *     },
 *     async signInWithPassword(email, password) {
 *       const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 *       if (error) return { user: null, error: error.message };
 *       return { user: { id: data.user.id, email: data.user.email! }, error: null };
 *     },
 *     async signUp({ name, email, password }) {
 *       const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
 *       if (error) return { user: null, error: error.message };
 *       return { user: { id: data.user!.id, email, name }, error: null };
 *     },
 *     async signOut() { await supabase.auth.signOut(); },
 *     async resetPassword(email) {
 *       const { error } = await supabase.auth.resetPasswordForEmail(email);
 *       return { error: error?.message ?? null };
 *     },
 *   };
 *   export const authService = supabaseAuthService;
 */

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
}

/* ------------------------------------------------------------------ */
/* Implementación mock (provisional)                                   */
/* ------------------------------------------------------------------ */

const SESSION_KEY = 'lumia_session';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());

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

/** Punto único de integración. Cambia esto por `supabaseAuthService` al migrar. */
export const authService: AuthService = mockAuthService;
