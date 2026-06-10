import { FormEvent, useState } from 'react';
import { InputField } from '../ui/InputField.tsx';
import { PrimaryButton } from '../ui/PrimaryButton.tsx';

interface RegisterCardProps {
  loading: boolean;
  error: string | null;
  onSubmit: (name: string, email: string, password: string) => void;
  onSwitchToLogin: () => void;
}

export const RegisterCard = ({
  loading,
  error,
  onSubmit,
  onSwitchToLogin,
}: RegisterCardProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [touched, setTouched] = useState(false);

  const mismatch = touched && confirm.length > 0 && confirm !== password;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!name || !email || !password || !confirm) return;
    if (password !== confirm) return;
    onSubmit(name, email, password);
  };

  return (
    <form className="av-auth-form" onSubmit={submit} noValidate>
      <InputField
        label="Nombre"
        icon="user"
        autoComplete="name"
        value={name}
        onChange={setName}
        error={touched && !name ? 'Introduce tu nombre.' : undefined}
      />
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
        autoComplete="new-password"
        value={password}
        onChange={setPassword}
        error={touched && password.length > 0 && password.length < 6 ? 'Mínimo 6 caracteres.' : undefined}
      />
      <InputField
        label="Confirmar contraseña"
        type="password"
        icon="lock"
        autoComplete="new-password"
        value={confirm}
        onChange={setConfirm}
        error={mismatch ? 'Las contraseñas no coinciden.' : undefined}
      />

      {error && <p className="av-auth-alert">{error}</p>}

      <PrimaryButton type="submit" block loading={loading}>
        Crear cuenta
      </PrimaryButton>

      <button type="button" className="av-auth-switch" onClick={onSwitchToLogin}>
        ¿Ya tienes cuenta? <strong>Iniciar sesión</strong>
      </button>
    </form>
  );
};
