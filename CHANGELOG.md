# Changelog

Registro de cambios de Lumia. El formato sigue, de forma ligera,
[Keep a Changelog](https://keepachangelog.com/es-ES/).

## [Sin publicar]

### Añadido
- **Acceso (login / registro)** integrado en la pantalla de bienvenida como una
  tarjeta del lenguaje Lumia, con transición de altura, validación, mostrar/
  ocultar contraseña y enlace de "¿Olvidaste tu contraseña?".
  - Componentes nuevos: `AuthContainer`, `LoginCard`, `RegisterCard`,
    `InputField`, `GlassInput`, `PrimaryButton`.
  - Hook `useAuth` y capa de servicio `services/auth.ts` con la interfaz
    `AuthService` (implementación _mock_ con `localStorage`) **lista para
    Supabase Authentication** mediante un único punto de cambio.
  - Espacio preparado para social login (Google · Apple · GitHub), sin
    implementar.
- **Modo claro / oscuro** en toda la app vía _design tokens_, hook `useTheme`
  (persiste y respeta la preferencia del sistema) y `ThemeToggle`.
- **Pantalla de bienvenida** de marca con el logo Lumia (`BrandLogo`).

### Cambiado
- Nuevo flujo de entrada: _Welcome → Comenzar despliega el acceso → al
  autenticarse entra a la app_. Un usuario con sesión entra directo al Home.
- El acceso dejó de estar al pie del Home y ahora vive en la bienvenida.
- **Diseño responsivo** con foco en teléfonos y pantallas medianas: tipografía
  fluida (`clamp`), ajustes para teléfonos pequeños (≤ 380px), columna centrada
  uniforme en medianas (≥ 720px) y `safe-area` para el notch.
- Radio de las tarjetas reducido para un acabado más sobrio
  (`--r-card` 32 → 22px, `--r-input` 28 → 24px, `--r-btn` 24 → 20px).
- Iconos outline añadidos: `mail`, `lock`, `user`, `eye`, `eye-off`,
  `chevron-left`, `sun`.

### Corregido
- **Borde visible del logo Lumia**: el fondo horneado del PNG mostraba un
  rectángulo contra la iluminación. Se desvanecen los bordes con una máscara
  (`mask-composite: intersect`) que conserva el halo y elimina la línea, en
  claro y oscuro.

## [0.1.0] — Initial commit

- Rediseño completo de la pantalla principal según el **Aveli Design System**
  (glassmorphism, tipografía Display/UI, fondos fotográficos por día).
- Home: saludo editorial, captura rápida, tarjeta _Hoy_ (timeline), _Rutinas_,
  _Urgente_ y _Espacios libres_.
- Calendario en cápsula de vidrio expandible.
- Estructura del repositorio organizada e inicializada.
