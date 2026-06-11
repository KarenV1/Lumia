# Changelog

Registro de cambios de Lumia. El formato sigue, de forma ligera,
[Keep a Changelog](https://keepachangelog.com/es-ES/).

## [Sin publicar]

### Añadido
- **Rutinas editables** con bottom sheet glass (modal en desktop): crear, editar,
  eliminar y activar/desactivar. Cada rutina elige **nombre, icono, color y
  frecuencia**. Componente nuevo `RoutineEditor` + utilidades `utils/routine.ts`.
- **Frecuencia de rutinas**: todos los días · días específicos · cada cierto
  intervalo (20/30 min, 1/3 h) con rango horario opcional · una vez al día.
- **Selector de iconos** outline para rutinas (12 opciones: luna, gota, libro,
  laptop, taza, corazón, manzana, sol, estrella, check, caminata, campana).
- **Saturación por día en el calendario**: cada día se tiñe de rosa según qué tan
  ocupado está (escala 0.12 → 0.62), calculado con `utils/dayLoad.ts`.
- **Captura rápida funcional**: el botón "Añadir pendiente rápido" despliega un
  panel glass para crear una tarea real con **título**, **día y hora** (su lugar
  en el calendario) y **relevancia** (urgencia con colores pastel). La tarea se
  persiste y aparece en _Hoy_ y en el calendario del día.
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
- La tarjeta _Hoy_ ahora **ordena las tareas por hora** y muestra todas las del
  día (antes se limitaba a 3).
- **Barra superior simplificada**: se quitaron la hora y los iconos simulados de
  señal, wifi y batería; arriba solo queda el cambio de tema, discreto.
- **"Ver agenda" → "Calendario"**: la acción abre el calendario directamente, sin
  paso intermedio (cápsula).
- Se **eliminaron los contadores** de cantidad en _Hoy_, _Rutinas_ y los badges
  del calendario, por una estética más limpia.
- El **calendario** gana espaciado (gap, padding, margen) para que los números no
  se encimen con la agenda inferior; semana de lunes a domingo.
- **Responsive móvil**: recuadro de día/hora con `flex-wrap`/`min-width` para que
  no se encime; editor y captura validados de 360px a 430px.

### Corregido
- **Borde visible del logo Lumia**: el fondo horneado del PNG mostraba un
  rectángulo contra la iluminación. Se desvanecen los bordes con una máscara
  (`mask-composite: intersect`) que conserva el halo y elimina la línea, en
  claro y oscuro.
- **Fecha "hoy" con desfase de un día**: `getDateString` usaba UTC; ahora usa la
  fecha local, así el día coincide en encabezado, _Hoy_, calendario y captura
  rápida.
- **Desfase del logo al cambiar de tema**: el logo era un PNG con fondo que
  tardaba en recargar y mostraba un rectángulo. Ahora es un **SVG vectorial
  inline** (sol con degradado durazno + "LUMIA" en `currentColor`), sin fondo ni
  borde, que cambia de tema al instante junto al resto de la UI.

## [0.1.0] — Initial commit

- Rediseño completo de la pantalla principal según el **Aveli Design System**
  (glassmorphism, tipografía Display/UI, fondos fotográficos por día).
- Home: saludo editorial, captura rápida, tarjeta _Hoy_ (timeline), _Rutinas_,
  _Urgente_ y _Espacios libres_.
- Calendario en cápsula de vidrio expandible.
- Estructura del repositorio organizada e inicializada.
