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

## Pantallas

- **Welcome** — portada de marca (logo Lumia) con selector de tema.
- **Home** — saludo editorial, captura rápida, tarjeta _Hoy_ (timeline),
  _Urgente_, _Espacios libres_ y _Rutinas_.
- **Calendario** — cápsula de vidrio que se expande a calendario + agenda del día.

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
│   │   ├── ui/        # Reutilizables (GlassCard, Icon, ThemeToggle, BrandLogo…)
│   │   ├── home/      # Bloques del Home (Header, Timeline, RoutineItem…)
│   │   ├── WelcomeScreen.tsx
│   │   ├── Dashboard.tsx
│   │   └── HomeScreen.tsx
│   ├── hooks/         # useTasks, useTheme, useClock
│   ├── utils/         # tiempo, fechas, espacios libres, estilos por categoría
│   ├── styles/        # aveli.css (componentes Home)
│   └── index.css      # tokens + capas de fondo + calendario
├── design-system.md   # Sistema de diseño (fuente de verdad)
└── branding.md        # Estado de la marca
```

## Roadmap

- [ ] Quick Add funcional (crear pendiente desde la barra)
- [ ] Edición de rutinas
- [ ] Clima en tiempo real
- [ ] Fotografías de fondo reales (hogar, naturaleza, luz)
- [ ] Sincronización en la nube
