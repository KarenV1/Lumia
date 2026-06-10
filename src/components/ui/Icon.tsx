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
  | 'battery';

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
