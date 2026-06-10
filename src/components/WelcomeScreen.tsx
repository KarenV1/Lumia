import { Theme } from '../hooks/useTheme.ts';
import { BrandLogo } from './ui/BrandLogo.tsx';
import { ThemeToggle } from './ui/ThemeToggle.tsx';

interface WelcomeScreenProps {
  theme: Theme;
  onToggleTheme: () => void;
  onEnter: () => void;
}

/**
 * Pantalla principal de marca (cover) de Lumia.
 * Mismo lenguaje visual: calma, luz cálida, glassmorphism. Soporta light/dark.
 */
export const WelcomeScreen = ({ theme, onToggleTheme, onEnter }: WelcomeScreenProps) => (
  <div className="av-welcome">
    <div className="av-welcome-top">
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>

    <div className="av-welcome-body">
      <BrandLogo theme={theme} variant="imagotipo" className="av-welcome-logo" />
      <p className="av-welcome-tagline">Tu día, en calma.</p>
    </div>

    <div className="av-welcome-foot">
      <button type="button" className="av-cta" onClick={onEnter}>
        Comenzar
      </button>
      <p className="av-welcome-hint">Organiza tu tiempo con claridad</p>
    </div>
  </div>
);
