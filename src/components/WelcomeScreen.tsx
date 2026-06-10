import { useState } from 'react';
import { Theme } from '../hooks/useTheme.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { BrandLogo } from './ui/BrandLogo.tsx';
import { ThemeToggle } from './ui/ThemeToggle.tsx';
import { PrimaryButton } from './ui/PrimaryButton.tsx';
import { AuthContainer } from './auth/AuthContainer.tsx';

interface WelcomeScreenProps {
  theme: Theme;
  onToggleTheme: () => void;
  auth: ReturnType<typeof useAuth>;
}

/**
 * Pantalla principal de marca (cover) de Lumia. Muestra el logo y, al pulsar
 * "Comenzar", despliega la tarjeta de acceso (login/registro) sobre la misma
 * pantalla. Al autenticarse, el padre (App) cambia a la app.
 */
export const WelcomeScreen = ({ theme, onToggleTheme, auth }: WelcomeScreenProps) => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className={`av-welcome${showAuth ? ' av-welcome--auth' : ''}`}>
      <div className="av-welcome-top">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="av-welcome-body">
        <BrandLogo theme={theme} variant="imagotipo" className="av-welcome-logo" />
        {!showAuth && <p className="av-welcome-tagline">Tu día, en calma.</p>}
      </div>

      <div className="av-welcome-foot">
        {showAuth ? (
          <div className="av-welcome-auth">
            <AuthContainer
              loading={auth.loading}
              error={auth.error}
              onSignIn={auth.signIn}
              onSignUp={auth.signUp}
              onForgot={auth.resetPassword}
              onClearError={auth.clearError}
            />
          </div>
        ) : (
          <>
            <PrimaryButton block onClick={() => setShowAuth(true)}>
              Comenzar
            </PrimaryButton>
            <p className="av-welcome-hint">Organiza tu tiempo con claridad</p>
          </>
        )}
      </div>
    </div>
  );
};
