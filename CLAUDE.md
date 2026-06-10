# Guía de Diseño - Agenda de Productividad

## Dirección Visual

Esta aplicación es una **pantalla móvil elegante tipo iOS**, no un dashboard corporativo. El diseño debe ser:
- **Calmado y personal**: Sensación íntima, no empresarial
- **Premium**: Uso de glassmorphism, fondos fotográficos, tipografía serif elegante
- **Mobile-first**: Vertical, limpio, minimalista
- **Fotográfico**: Fondos reales de la carpeta `fondos/` con blur y overlay suave

---

## 🚫 Lo que NUNCA debe hacer:

1. **No usar emojis** en ningún lugar de la UI
2. **No usar encabezados corporativos** tipo "Agenda de Productividad"
3. **No usar botones pesados** oscuros o tipo Bootstrap
4. **No usar tarjetas opacas** - deben ser translúcidas (glassmorphism)
5. **No usar formularios visibles** en pantalla principal (inputs grises pesados)
6. **No usar fondos sólidos oscuros** - siempre fondos fotográficos
7. **No usar colores neón** ni saturados
8. **No parecer dashboard administrativo**

---

## ✅ Lo que SÍ debe tener:

### Estructura Principal

```
[Fondo fotográfico difuminado + overlay suave]
  ↓
[Header: Saludo grande + fecha + clima]
  ↓
[Barra glass de captura rápida]
  ↓
[Tarjeta "Hoy" - glass translúcida]
  ↓
[Tarjeta "Rutinas" - glass translúcida]
  ↓
[Tarjeta "Urgente mañana" - glass compacta]
  ↓
[Barra "Espacios libres" - glass]
```

### Header

```
Hola,
Karen

MIÉRCOLES, 4 JUNIO          26° Parcialmente nublado
```

- Título: Serif elegante (Playfair Display), grande, blanco
- Subtítulo: Sans-serif limpia, gris claro
- Clima: Ícono lineal minimalista + texto gris

### Barra de Captura Rápida

```
[+]  Añadir pendiente rápido  [✨]
```

- Barra glass horizontal
- Botón circular con + 
- Texto centrado
- Ícono pequeño a la derecha
- NO debe parecer input HTML

### Tarjetas

Todas las tarjetas usan:
- `background: rgba(255, 255, 255, 0.08)`
- `backdrop-filter: blur(20px)`
- `border: 1px solid rgba(255, 255, 255, 0.25)`
- Esquinas redondeadas suaves
- Sombra suave (no dura)

**Tarjeta "Hoy":**
- Título "Hoy" - serif, blanco
- Badge "3" - número pequeño
- Link "VER AGENDA >" - gris claro, minúscula
- Timeline de tareas (3 items máximo)
  - Cada item: nombre, descripción, hora
  - Formato: `Trabajo creativo — Diseño de presentación — 09:00`

**Tarjeta "Rutinas":**
- Similar a "Hoy"
- Badge "3"
- Link "EDITAR >"
- Lista de rutinas con horarios

**Tarjeta "Urgente mañana":**
- Compacta
- Badge "1"
- Tarea única con hora límite
- Formato: `Entrega de proyecto final — Antes de las 11:00 AM`

**Barra "Espacios libres":**
- Barra glass horizontal inferior
- Texto: "Espacios libres"
- Rango: "12:30 – 14:00"
- Barra de progreso color durazno suave (rgba(210, 140, 100, 0.6))

---

## 🎨 Tipografía

**Títulos grandes (H1, saludo):**
- Font: `Playfair Display` o `Cormorant Garamond` (serif elegante)
- Size: 36-48px
- Weight: 700
- Color: blanco (#FFFFFF)

**Títulos medianos (nombres de tarjetas):**
- Font: `Playfair Display` (serif)
- Size: 20-24px
- Weight: 600
- Color: blanco (#FFFFFF)

**Texto normal (descripciones, subtítulos):**
- Font: `Inter` o `Manrope` (sans-serif limpia)
- Size: 14-16px
- Weight: 400-500
- Color: gris claro (#E8E8E8, #D0D0D0)

**Texto pequeño (hora, detalles):**
- Font: sans-serif
- Size: 12-13px
- Weight: 400
- Color: gris medio (#B0B0B0)

---

## 🎯 Paleta de Colores

**Neutral:**
- Blanco principal: `#FFFFFF`
- Gris claro: `#E8E8E8`
- Gris medio: `#B0B0B0`
- Gris oscuro (overlay): `rgba(0, 0, 0, 0.2)`

**Acentos Suaves:**
- Durazno suave: `rgba(210, 140, 100, 0.6)` (para barras de progreso)
- Lavanda suave: `rgba(180, 160, 200, 0.5)` (si se necesita)
- Azul grisáceo: `rgba(100, 120, 150, 0.3)` (en overlays)

**NUNCA:**
- Colores neón
- Negro puro (#000000)
- Azul o púrpura saturados
- Rojos agresivos

---

## 🔧 CSS y Componentes

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
```

### Fondo

- Imagen de `public/fondos/` según el día
- `background-size: cover`
- `background-position: center`
- Capa de blur: `backdrop-filter: blur(8px)` + overlay oscuro suave
- Capa de gradiente suave para contraste

### Componentes a Usar

1. `MobileShell` - contenedor principal, vertical
2. `Header` - saludo + fecha + clima
3. `QuickTaskBar` - barra glass de captura
4. `TodayCard` - tarjeta de tareas hoy
5. `RoutinesCard` - tarjeta de rutinas
6. `TomorrowUrgentCard` - tarjeta de urgentes
7. `FreeTimeBar` - barra de espacios libres

### Íconos

- Usar `lucide-react` o SVG lineales minimalistas
- NO usar emojis
- Íconos pequeños, peso 1.5-2px
- Color: gris claro, opacidad 0.7

---

## 📱 Layout

- **Mobile-first**: 100% del ancho
- **Padding**: 16-24px en los lados
- **Espaciado vertical**: 20-32px entre secciones
- **Máx. ancho**: 100% (es una pantalla móvil, no web)
- **Overflow**: Scroll vertical si es necesario

---

## 🎬 Comportamiento

- **Sin transiciones complejas** - suave, elegante
- **Sin animaciones excesivas** - solo hover sutil
- **Sin notificaciones intrusivas** - alertas elegantes
- **Sin sonidos** (a menos que sea necesario)
- **Responsive**: Funciona igual en móvil y desktop (se ve como pantalla de teléfono)

---

## ⚠️ Checklist de Validación

Antes de dar una sección por terminada, verifica:

- [ ] No hay emojis
- [ ] No hay encabezados corporativos
- [ ] Tipografía serif para títulos grandes
- [ ] Sans-serif limpia para texto normal
- [ ] Fondos fotográficos con blur y overlay
- [ ] Tarjetas translúcidas (glassmorphism real)
- [ ] Colores suaves (sin neón)
- [ ] Layout vertical mobile-first
- [ ] Botones/elementos minimalistas (no pesados)
- [ ] Texto blanco/gris claro muy legible
- [ ] No hay formularios visibles en pantalla principal
- [ ] Íconos lineales minimalistas (no emojis)
- [ ] Apariencia personal, calmada, premium

---

## 🔗 Referencias

- Inspiración visual: Pantalla iOS elegante, tipo Reminders o Notes
- Glassmorphism: UIGlassmorphism.com
- Tipografía: Google Fonts (Playfair Display, Inter)
