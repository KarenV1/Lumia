# Lumia

> Tu día, en calma.

Lumia es una aplicación de **bienestar y productividad** pensada como un espacio
sereno para organizar el día: tareas, rutinas, agenda y —sobre todo— para
visualizar cuánto tiempo libre tienes. No es un panel corporativo; es una
experiencia premium, fotográfica y de vidrio (glassmorphism), con modo claro y
oscuro.

> **Nota de marca:** _Lumia_ es el nombre de trabajo (temporal). El sistema
> visual se documenta como **Aveli** en [`design-system.md`](design-system.md).
> Ver [`branding.md`](branding.md) para el estado de la marca.

## Identidad visual

Toda decisión visual sale de [`design-system.md`](design-system.md) como única
fuente de verdad:

- **Tipografía** — Display: _Canela_ → _Cormorant Garamond_ (Light) · Interfaz:
  _SF Pro Display_ → _Inter_.
- **Glassmorphism** — vidrio translúcido, blur 35px, bordes muy redondeados,
  sombras suaves.
- **Paleta pastel** — rosa, lavanda, azul, verde salvia, beige sobre fotografías
  cálidas y luminosas.
- **Modo claro / oscuro** — todo el sistema está construido sobre _design
  tokens_, así que el tema cambia en toda la app.

## Pantallas y flujo

```
Welcome (logo + "Comenzar")
   └─ Comenzar → despliega la tarjeta de acceso (login / registro)
        └─ al autenticarse → entra a la app
              └─ Home (con sesión activa entra directo aquí)
```

- **Welcome** — portada de marca (logo Lumia), selector de tema y, al pulsar
  _Comenzar_, despliega en la misma pantalla la tarjeta de acceso.
- **Home** — saludo editorial, captura rápida, tarjeta _Hoy_ (timeline),
  _Urgente_, _Espacios libres_ y _Rutinas_.
- **Calendario** — cápsula de vidrio que se expande a calendario + agenda del día.

## Acceso (login / registro)

El acceso es una tarjeta más del lenguaje Lumia (glass, animación de altura,
modo claro/oscuro), integrada en la pantalla de bienvenida:

- Estado inicial colapsado → _Iniciar sesión_ / _Crear cuenta_.
- Formularios de login y registro con validación, mostrar/ocultar contraseña y
  "¿Olvidaste tu contraseña?".
- Espacio **preparado** para Google · Apple · GitHub (aún sin implementar).
- La sesión se persiste y un usuario con sesión entra directo a la app.

**Listo para Supabase:** toda la app depende de la interfaz `AuthService`
([`src/services/auth.ts`](src/services/auth.ts)). Hoy usa una implementación
_mock_ con `localStorage`; migrar a Supabase Authentication es cambiar una sola
línea (la exportación de `authService`). El esqueleto de Supabase está incluido
como referencia comentada.

## Diseño responsivo

Mobile-first, con foco en teléfonos y pantallas medianas:

- Tipografía fluida (`clamp`) para el saludo, sin desbordes en pantallas
  estrechas.
- Ajustes específicos para teléfonos pequeños (≤ 380px) y columna centrada
  uniforme en medianas (≥ 720px).
- `safe-area` para el notch.
- El borde del logo se desvanece con una máscara de bordes para que se funda con
  la iluminación del fondo sin línea rectangular.

## Tecnología

- **React 18** + **TypeScript**
- **Vite** (dev server y build)
- **Tailwind CSS** + CSS tokens propios
- **localStorage** para persistencia

## Desarrollo

Requisitos: Node.js 16+.

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## Estructura

```
.
├── assets/            # Material fuente (fotografías y logos originales)
├── public/
│   ├── fondos/        # Fondos servidos por día
│   └── logos/         # Logos Lumia (variantes light/dark)
├── src/
│   ├── components/
│   │   ├── ui/        # Reutilizables (GlassCard, Icon, ThemeToggle, BrandLogo,
│   │   │              #   PrimaryButton, InputField, GlassInput, SectionHeader)
│   │   ├── home/      # Bloques del Home (Header, Timeline, RoutineItem…)
│   │   ├── auth/      # AuthContainer, LoginCard, RegisterCard
│   │   ├── WelcomeScreen.tsx
│   │   ├── Dashboard.tsx
│   │   └── HomeScreen.tsx
│   ├── hooks/         # useTasks, useTheme, useClock, useAuth
│   ├── services/      # auth.ts (interfaz AuthService + mock, listo para Supabase)
│   ├── utils/         # tiempo, fechas, espacios libres, estilos por categoría
│   ├── styles/        # aveli.css (componentes Home, auth, responsive)
│   └── index.css      # tokens + capas de fondo + calendario
├── design-system.md   # Sistema de diseño (fuente de verdad)
└── branding.md        # Estado de la marca
```

## Roadmap

- [x] Modo claro / oscuro en toda la app
- [x] Acceso (login / registro) integrado en la bienvenida
- [x] Diseño responsivo (teléfonos y medianas)
- [ ] Conectar Supabase Authentication (reemplazar el `authService` mock)
- [ ] Social login real (Google · Apple · GitHub)
- [ ] Quick Add funcional (crear pendiente desde la barra)
- [ ] Edición de rutinas
- [ ] Clima en tiempo real
- [ ] Fotografías de fondo reales (hogar, naturaleza, luz)
