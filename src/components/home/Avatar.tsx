interface AvatarProps {
  /** Inicial a mostrar cuando no hay foto */
  initial?: string;
  src?: string;
  alt?: string;
}

/**
 * Avatar circular pequeño con borde blanco. Si no hay foto, muestra la inicial
 * sobre un degradado pastel.
 */
export const Avatar = ({ initial = 'K', src, alt = 'Perfil' }: AvatarProps) => (
  <div className="av-avatar">
    {src ? <img src={src} alt={alt} width={40} height={40} /> : <span>{initial}</span>}
  </div>
);
