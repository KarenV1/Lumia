import { FormEvent, useState } from 'react';
import { InputField } from '../ui/InputField.tsx';
import { PrimaryButton } from '../ui/PrimaryButton.tsx';

interface LoginCardProps {
  loading: boolean;
  error: string | null;
  onSubmit: (email: string, password: string) => void;
  onForgot: (email: string) => void;
  onSwitchToRegister: () => void;
}

export const LoginCard = ({
  loading,
  error,
  onSubmit,
  onForgot,
  onSwitchToRegister,
}: LoginCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email || !password) return;
    onSubmit(email, password);
  };

  return (
    <form className="av-auth-form" onSubmit={submit} noValidate>
      <InputField
        label="Correo electrónico"
        type="email"
        icon="mail"
        autoComplete="email"
        value={email}
        onChange={setEmail}
        error={touched && !email ? 'Introduce tu correo.' : undefined}
      />
      <InputField
        label="Contraseña"
        type="password"
        icon="lock"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        error={touched && !password ? 'Introduce tu contraseña.' : undefined}
      />

      {error && <p className="av-auth-alert">{error}</p>}

      <PrimaryButton type="submit" block loading={loading}>
        Iniciar sesión
      </PrimaryButton>

      <button type="button" className="av-auth-link" onClick={() => onForgot(email)}>
        ¿Olvidaste tu contraseña?
      </button>

      <button type="button" className="av-auth-switch" onClick={onSwitchToRegister}>
        ¿No tienes cuenta? <strong>Crear cuenta</strong>
      </button>
    </form>
  );
};
