import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SignUpParams } from '../../services/auth.ts';
import { Icon } from '../ui/Icon.tsx';
import { PrimaryButton } from '../ui/PrimaryButton.tsx';
import { LoginCard } from './LoginCard.tsx';
import { RegisterCard } from './RegisterCard.tsx';

type Mode = 'collapsed' | 'login' | 'register';

interface AuthContainerProps {
  loading: boolean;
  error: string | null;
  onSignIn: (email: string, password: string) => Promise<boolean> | void;
  onSignUp: (params: SignUpParams) => Promise<boolean> | void;
  onForgot: (email: string) => Promise<boolean>;
  onClearError: () => void;
}

/** Proveedores sociales — espacio preparado, aún sin implementar. */
const COMING_SOON = ['Google', 'Apple', 'GitHub'];

/**
 * Tarjeta de acceso a Lumia. Estado inicial colapsado (dos opciones) que se
 * expande con una transición suave de altura hacia el formulario de login o
 * registro. Es controlada: la sesión vive en el contenedor padre, que decide
 * navegar a la app cuando la autenticación tiene éxito.
 */
export const AuthContainer = ({
  loading,
  error,
  onSignIn,
  onSignUp,
  onForgot,
  onClearError,
}: AuthContainerProps) => {
  const [mode, setMode] = useState<Mode>('collapsed');
  const [notice, setNotice] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  // Mide el contenido para animar la altura del escenario
  useLayoutEffect(() => {
    if (stageRef.current) setHeight(stageRef.current.offsetHeight);
  }, [mode, error, notice, loading]);

  useEffect(() => {
    const remeasure = () => {
      if (stageRef.current) setHeight(stageRef.current.offsetHeight);
    };
    window.addEventListener('resize', remeasure);
    return () => window.removeEventListener('resize', remeasure);
  }, []);

  const go = (next: Mode) => {
    onClearError();
    setNotice(null);
    setMode(next);
  };

  const handleForgot = async (email: string) => {
    const ok = await onForgot(email);
    if (ok) setNotice('Te enviamos un enlace para restablecer tu contraseña.');
  };

  return (
    <section className="av-card av-auth" aria-label="Acceder a Lumia">
      <div className="av-auth-stage" style={{ height }}>
        <div ref={stageRef} className="av-auth-inner" key={mode}>
          {mode !== 'collapsed' && (
            <div className="av-auth-head">
              <button
                type="button"
                className="av-auth-back"
                onClick={() => go('collapsed')}
                aria-label="Volver"
              >
                <Icon name="chevron-left" size={20} />
              </button>
              <h3 className="av-auth-headtitle">
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </h3>
            </div>
          )}

          {mode === 'collapsed' && (
            <div className="av-auth-collapsed">
              <h3 className="av-auth-title">Continuar con Lumia</h3>
              <p className="av-auth-sub">Guarda tu día y tenlo en todos tus dispositivos.</p>

              <div className="av-auth-choices">
                <PrimaryButton block onClick={() => go('login')}>
                  Iniciar sesión
                </PrimaryButton>
                <PrimaryButton block variant="ghost" onClick={() => go('register')}>
                  Crear cuenta
                </PrimaryButton>
              </div>

              {/* Espacio preparado para Google · Apple · GitHub (aún sin implementar) */}
              <div className="av-auth-divider">o continúa con</div>
              <div className="av-auth-social">
                {COMING_SOON.map((p) => (
                  <button key={p} type="button" className="av-social" disabled title="Próximamente">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'login' && (
            <>
              <LoginCard
                loading={loading}
                error={error}
                onSubmit={onSignIn}
                onForgot={handleForgot}
                onSwitchToRegister={() => go('register')}
              />
              {notice && <p className="av-auth-notice">{notice}</p>}
            </>
          )}

          {mode === 'register' && (
            <RegisterCard
              loading={loading}
              error={error}
              onSubmit={(name, email, password) => onSignUp({ name, email, password })}
              onSwitchToLogin={() => go('login')}
            />
          )}
        </div>
      </div>
    </section>
  );
};
