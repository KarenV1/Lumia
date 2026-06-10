# DESIGN_SYSTEM.md

# Aveli Design System

Versión: 1.0

---

# Filosofía

Aveli no es una aplicación de productividad.

Es un espacio de calma donde organizar la vida.

La experiencia debe transmitir:

* tranquilidad
* claridad
* elegancia
* comodidad
* orden
* respiración visual

Cada pantalla debe sentirse ligera.

Nunca debe parecer una herramienta corporativa.

Nunca debe sentirse saturada.

La aplicación debe dar la sensación de que el tiempo está bajo control.

---

# Principios de diseño

Toda decisión visual debe responder a estas reglas.

## 1. El contenido es el protagonista.

La interfaz nunca debe competir con la información.

Los fondos sirven para generar una emoción.

Las tarjetas sirven para facilitar la lectura.

El contenido siempre tiene prioridad.

---

## 2. Mucho espacio negativo.

No llenar la pantalla.

Siempre dejar aire entre componentes.

Si un elemento puede hacerse más simple, hacerlo.

---

## 3. Una sola acción principal por pantalla.

Cada pantalla debe responder inmediatamente:

¿Qué quiere hacer el usuario aquí?

No agregar botones innecesarios.

---

## 4. Elegancia antes que decoración.

No usar:

* degradados llamativos
* colores saturados
* sombras fuertes
* efectos exagerados

Todo debe sentirse natural.

---

# Personalidad visual

Palabras clave:

Minimalista

Escandinavo

Premium

Editorial

Calm Tech

Apple

Glassmorphism

Lifestyle

---

# Inspiración

El diseño debe sentirse como una mezcla entre:

Apple Journal

Apple Weather

Apple Reminders

Apple Calendar

Notion Calendar

Reflectly

Headspace

Arc Browser

Nothing OS

pero sin copiar ninguna interfaz.

---

# Fotografías

Toda la aplicación utiliza fotografías reales.

Nunca ilustraciones.

Nunca renders.

Nunca imágenes muy contrastadas.

---

Las fotografías deben transmitir:

hogar

naturaleza

luz

tranquilidad

comodidad

silencio

bienestar

---

Tipos de fondos permitidos:

* habitación minimalista
* cama iluminada
* bosque
* lago
* playa
* cielo
* amanecer
* café
* escritorio acogedor
* jardín
* avión entre nubes
* ventana con lluvia
* rincón de lectura

---

Todas las imágenes deben tener:

profundidad de campo

desenfoque

bokeh

luz natural

contraste suave

colores cálidos

espacio negativo suficiente para colocar contenido encima.

---

# Colores

## Primario

#FFFFFF

---

## Texto secundario

rgba(255,255,255,.72)

---

## Texto deshabilitado

rgba(255,255,255,.45)

---

## Fondo Glass

rgba(70,70,70,.18)

---

## Borde Glass

rgba(255,255,255,.16)

---

## Rosa

#F5D5CB

---

## Lavanda

#DCCFE9

---

## Azul

#C7E4EF

---

## Verde salvia

#C8D6C4

---

## Beige

#E8D6BF

---

Nunca usar:

rojos intensos

verdes fluorescentes

azules eléctricos

amarillos saturados

---

# Glassmorphism

Todas las tarjetas utilizan vidrio translúcido.

Características:

background

rgba(80,80,80,.18)

backdrop-filter

blur(35px)

border

1px solid rgba(255,255,255,.16)

shadow

muy suave

radio

32px

---

# Bordes

Todos los componentes utilizan bordes redondeados.

Inputs

28px

Cards

32px

Botones

24px

FAB

100%

---

# Sombras

Siempre muy suaves.

Nunca usar negro puro.

Ejemplo:

0 12px 30px rgba(0,0,0,.10)

---

# Tipografía

## Display

Canela

Si no está disponible:

Cormorant Garamond

---

Uso:

Saludos

Títulos

Portadas

Secciones

---

Peso

Light

---

## Interfaz

SF Pro Display

Si no existe:

Inter

---

Usar para:

botones

listas

inputs

horas

descripciones

---

# Escala tipográfica

Hero

68px

H1

44px

H2

32px

H3

24px

Body

18px

Caption

14px

Small

12px

---

# Espaciado

Base

8px

Separaciones

16px

Entre tarjetas

24px

Padding tarjetas

32px

Márgenes pantalla

24px

---

# Iconografía

Solo iconos outline.

Nunca rellenos.

Nunca caricaturescos.

Grosor uniforme.

Tamaño

22-24px

---

# Botones

Botón principal

Fondo rosa pastel

Texto oscuro

Mucho padding

Radio 24px

---

Botones secundarios

Glass

Sin relleno sólido

---

# Tarjetas

Cada tarjeta debe tener:

Título

Acción secundaria

Contenido

Padding amplio

Mucho espacio

Nunca más de una función principal por tarjeta.

---

# Inputs

Altura

56px

Placeholder gris claro

Sin borde grueso

Glass

Radio 28px

---

# Animaciones

Todas las transiciones deben sentirse naturales.

Usar:

opacity

blur

scale

translateY

Nunca usar rebotes exagerados.

---

Duración

250-350ms

---

Curva

ease-out

---

# Movimiento

Al abrir:

fade + slide up

Al tocar:

scale 0.98

Al pasar el mouse:

ligero brillo

---

# Agenda

La agenda siempre se representa como una línea de tiempo.

Nunca como una tabla.

Las horas siempre alineadas a la derecha.

Iconos alineados a la izquierda.

---

# Rutinas

Cada rutina tiene:

ícono

nombre

horario

color propio

Dormir

Lavanda

Agua

Azul

Trabajo

Gris

Cursos

Beige

Ejercicio

Verde

---

# Urgencias

No utilizar rojo fuerte.

Las urgencias utilizan:

círculo rosa

ícono oscuro

tarjeta ligeramente más oscura

---

# Espacios libres

Siempre deben destacarse.

Mostrar:

bloque

barra

timeline

o tarjetas disponibles.

El objetivo principal de Aveli es ayudar al usuario a visualizar cuánto tiempo libre tiene.

---

# Accesibilidad

Contraste AA.

Texto siempre legible sobre fondos.

Nunca colocar texto directamente sobre fotografías sin una capa glass o degradado.

---

# Responsive

Diseñar primero para móvil.

Escalar después a tablet y escritorio.

Nunca al revés.

---

# Consistencia

Antes de crear cualquier componente nuevo, verificar:

¿Respeta la paleta?

¿Respeta la tipografía?

¿Respeta el espaciado?

¿Respeta el sistema glass?

¿Respeta la filosofía de calma?

Si la respuesta es "no", rediseñarlo antes de implementarlo.

---

# Regla más importante

Si existe una solución más simple y elegante, siempre elegir la más simple.

Aveli debe sentirse como una aplicación que el usuario abre porque le transmite paz, incluso antes de empezar a organizar su día.
