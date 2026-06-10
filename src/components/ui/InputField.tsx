import { useState } from 'react';
import { GlassInput } from './GlassInput.tsx';
import { Icon, IconName } from './Icon.tsx';

interface InputFieldProps {
  /** Etiqueta accesible (no siempre visible) */
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  icon?: IconName;
  autoComplete?: string;
  name?: string;
  error?: string;
}

/**
 * Campo de formulario: icono opcional + GlassInput + revelar contraseña + error.
 */
export const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  icon,
  autoComplete,
  name,
  error,
}: InputFieldProps) => {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (reveal ? 'text' : 'password') : type;

  return (
    <div className="av-field">
      <div className={`av-input-wrap${error ? ' av-input-wrap--error' : ''}`}>
        {icon && (
          <span className="av-input-icon" aria-hidden="true">
            <Icon name={icon} size={19} />
          </span>
        )}
        <GlassInput
          type={inputType}
          name={name}
          aria-label={label}
          value={value}
          placeholder={placeholder ?? label}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={`${icon ? 'av-input--has-icon' : ''}${
            isPassword ? ' av-input--has-trail' : ''
          }`.trim()}
        />
        {isPassword && (
          <button
            type="button"
            className="av-input-trail"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <Icon name={reveal ? 'eye-off' : 'eye'} size={19} />
          </button>
        )}
      </div>
      {error && <span className="av-field-error">{error}</span>}
    </div>
  );
};
