/**
 * Iconos outline (estilo SF Symbols).
 * Trazo uniforme, sin rellenos, currentColor. Ref: design-system.md
 */

export type IconName =
  | 'plus'
  | 'arrow-right'
  | 'clock'
  | 'cloud-sun'
  | 'moon'
  | 'droplet'
  | 'book'
  | 'briefcase'
  | 'dumbbell'
  | 'alert'
  | 'sparkle'
  | 'sun'
  | 'signal'
  | 'wifi'
  | 'battery'
  | 'chevron-left'
  | 'chevron-down'
  | 'mail'
  | 'lock'
  | 'user'
  | 'eye'
  | 'eye-off'
  | 'laptop'
  | 'cup'
  | 'heart'
  | 'apple'
  | 'star'
  | 'check'
  | 'walk'
  | 'bell'
  | 'trash'
  | 'pencil';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  plus: <path d="M12 5v14M5 12h14" />,
  'arrow-right': <path d="M5 12h14M13 6l6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  'cloud-sun': (
    <>
      <path d="M7 7a3 3 0 0 1 5.5-1.6" />
      <path d="M12 3v1.5M5.2 5.2l1 1M3 12h1.5M19.5 7.5 18.5 8.5" />
      <path d="M7 18a3.5 3.5 0 0 1 .3-7 4.5 4.5 0 0 1 8.6 1.2A3 3 0 0 1 16 18Z" />
    </>
  ),
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.2 6.2 0 0 0 10.5 10.5Z" />,
  droplet: <path d="M12 3.5c3 3.6 5.5 6.6 5.5 9.5a5.5 5.5 0 0 1-11 0c0-2.9 2.5-5.9 5.5-9.5Z" />,
  book: (
    <>
      <path d="M5 5.5A2 2 0 0 1 7 4h11v13H7a2 2 0 0 0-2 2Z" />
      <path d="M5 19a2 2 0 0 0 2 2h11" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2.5" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.5 21 19.5H3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  sparkle: <path d="M12 4c.6 3.4 1.6 4.4 5 5-3.4.6-4.4 1.6-5 5-.6-3.4-1.6-4.4-5-5 3.4-.6 4.4-1.6 5-5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
    </>
  ),
  signal: (
    <>
      <path d="M4 18v-2M9 18v-5M14 18v-8M19 18V7" />
    </>
  ),
  wifi: (
    <>
      <path d="M4.5 9a11 11 0 0 1 15 0M7.5 12a7 7 0 0 1 9 0M10.5 15a3 3 0 0 1 3 0" />
      <path d="M12 18h.01" />
    </>
  ),
  battery: (
    <>
      <rect x="3" y="8" width="16" height="8" rx="2" />
      <path d="M21 11v2" />
      <rect x="5" y="10" width="9" height="4" rx="1" fill="currentColor" stroke="none" />
    </>
  ),
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M4 7.5l8 5.5 8-5.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': (
    <>
      <path d="M4 4l16 16" />
      <path d="M6.7 6.8C4 8.5 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.5 0 2.9-.4 4.1-1" />
      <path d="M9.9 9.7A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9" />
      <path d="M14.5 5.9A9.3 9.3 0 0 0 12 5.5" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  laptop: (
    <>
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M2.5 20h19" />
    </>
  ),
  cup: (
    <>
      <path d="M5 8h11v5a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5Z" />
      <path d="M16 9h2.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3.5v2M11.5 3.5v2" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.6 12 20 12 20Z" />,
  apple: (
    <>
      <path d="M12 8c-1.2-1.2-3.2-1.6-5-.6-2.3 1.3-2.6 5-1 8 1 1.8 2.4 3.2 3.6 3.2.8 0 1.2-.4 2.4-.4s1.6.4 2.4.4c1.2 0 2.6-1.4 3.6-3.2 1.6-3 1.3-6.7-1-8-1.8-1-3.8-.6-5 .6Z" />
      <path d="M12 8c.2-1.6 1-3 2.5-3.5" />
    </>
  ),
  star: <path d="M12 4l2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1L4.5 9.5l5.2-.8Z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  walk: (
    <>
      <circle cx="13" cy="4.5" r="1.6" />
      <path d="M11.5 9l-2 4 2.5 2 1 5M13.5 8l2.5 3 2.5.8M9.5 13l-2.5 1.5L5 20" />
    </>
  ),
  bell: (
    <>
      <path d="M6.5 17V11a5.5 5.5 0 0 1 11 0v6l1.5 2H5Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
    </>
  ),
  pencil: (
    <>
      <path d="M4 20l4-1L19 8a2 2 0 0 0-3-3L5 16Z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
};

export const Icon = ({ name, size = 22, className = '', strokeWidth }: IconProps) => (
  <svg
    className={`av-icon ${className}`}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={strokeWidth ? { strokeWidth } : undefined}
  >
    {paths[name]}
  </svg>
);
