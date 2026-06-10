import { Icon } from '../ui/Icon.tsx';

interface QuickTaskInputProps {
  placeholder?: string;
  onAdd?: () => void;
}

/**
 * Barra elegante de captura rápida. Primer elemento interactivo de la pantalla.
 * No es un formulario: botón rosa pastel + placeholder sobre vidrio.
 */
export const QuickTaskInput = ({
  placeholder = 'Añadir pendiente rápido',
  onAdd,
}: QuickTaskInputProps) => (
  <div className="av-quickadd" onClick={onAdd} role="button" tabIndex={0}>
    <button type="button" className="av-quickadd-fab" aria-label="Añadir pendiente">
      <Icon name="plus" size={22} strokeWidth={2} />
    </button>
    <span className="av-quickadd-placeholder">{placeholder}</span>
  </div>
);
