# Paso 0: la identidad visual de cada persona

El método es común; la identidad es de cada uno. Este paso produce dos archivos que se guardan en la carpeta de trabajo (o se pegan en las instrucciones del proyecto de claude.ai):

- `identidad.md`: la identidad explicada en palabras, para que cualquier Claude la entienda.
- `identidad.json`: los valores exactos que usa `scripts/montar.mjs`.

## 1. La entrevista (5 minutos)

Hazla en dos o tres mensajes, no en un formulario. Si la persona responde "me da igual" a algo, decide tú a partir del resto y dilo.

1. **¿De qué hablas y para quién?** Tema, público, plataforma principal.
2. **¿Cómo quieres que te perciban en tres palabras?** (cercano, experto, gamberro, elegante, técnico, inspirador…)
3. **Dos o tres creadores o marcas cuya estética te guste**, y qué te gusta exactamente de ellas (el ritmo, los colores, las letras, la limpieza…). Sirve para entender el gusto, **no para copiarlo**.
4. **¿Tienes ya colores, logo o tipografía?** Si los tiene, mandan sobre todo lo demás.
5. **¿Fondo oscuro o claro?** ¿Grabas con fondo real o te gusta que los gráficos ocupen pantalla?
6. **¿Cuánta energía?** Del 1 (sobrio, documental) al 5 (rápido, golpes, mucho movimiento).
7. **¿Qué no quieres ver nunca en tus vídeos?**

## 2. Propón tres direcciones, no una

Con las respuestas, propón **tres direcciones distintas** a partir de los arquetipos de abajo (o mezclándolos). Para cada una da: nombre, paleta con el papel de cada color, par de fuentes, fondo, estilo de subtítulo y una frase de cómo se movería. Si puedes generar imágenes o HTML, enseña un fotograma de muestra de cada una.

La persona elige una (o mezcla). Ajusta y confirma antes de guardar.

### Arquetipos de partida

Son puntos de partida, no plantillas. Cambia siempre al menos el acento y una de las fuentes según la persona.

| Arquetipo | Sensación | Fondo | Fuentes (Google Fonts, OFL) | Subtítulo | Movimiento |
|---|---|---|---|---|---|
| **Minimal claro** | limpio, calmado, premium | blanco roto o crema, liso | Manrope 800 + Manrope 500 | color en la palabra activa | suave |
| **Editorial** | revista, criterio, opinión | papel cálido o tinta oscura, grano | Fraunces 700 + Inter 500 | subrayado que se dibuja | suave |
| **Tecnológico** | preciso, de ingeniero | casi negro con retícula de puntos | Space Grotesk 700 + JetBrains Mono 500 | caja con borde | preciso |
| **Pop enérgico** | rápido, divertido, joven | color saturado plano | Bricolage Grotesque 800 + DM Sans 500 | resaltador detrás de la palabra | enérgico |
| **Cálido cercano** | conversación, confianza | degradado suave cálido | DM Serif Display + DM Sans 500 | píldora redondeada | suave |
| **Brutalista** | directo, sin adornos | liso, alto contraste, sin sombras | Archivo Black + IBM Plex Mono 500 | caja sólida, mayúsculas | preciso |

## 3. Reglas que cualquier identidad debe cumplir

- **Papeles de color fijos.** Cada color tiene un significado y no se usa para otra cosa: `acento` (lo nuevo, la solución, la palabra activa), `enfasis` (cifras, "ojo con esto"), `bien` (resultado, funciona), `mal` (problema, error). Máximo 5 colores activos en pantalla.
- **Contraste.** Texto sobre fondo con contraste mínimo 4,5:1. Compruébalo antes de guardar; si no llega, ajusta el tono, no el tamaño.
- **Dos familias tipográficas como máximo** (más una mono si habla de código). Pesos gruesos para titulares y subtítulos: en el móvil el vídeo se ve pequeño.
- **Fuentes en local.** Descarga los `.woff2` a `assets/fonts/` y decláralos con `@font-face`. Nada de cargarlas desde internet en el render.
- **Una "firma".** Elige un detalle propio que se repita en todos los vídeos (una forma de tarjeta, un color de resaltado, una palabra en otra fuente, una transición). Es lo que hace reconocible a la persona.
- **Nada prestado.** Si la persona quiere "que se parezca a X", toma el ritmo y las técnicas, nunca su paleta exacta, sus fuentes, su logo ni sus frases.

## 4. `identidad.json`

```json
{
  "nombre": "Nombre o marca de la persona",
  "tema": "oscuro",
  "colores": {
    "fondo": "#101418",
    "fondo2": "#1A2027",
    "texto": "#F2F4F7",
    "secundario": "#93A1B0",
    "acento": "#2FD4C4",
    "enfasis": "#FFC145",
    "bien": "#4ADE80",
    "mal": "#F87171"
  },
  "fuentes": {
    "titular": { "familia": "Space Grotesk", "peso": 700, "archivo": "assets/fonts/SpaceGrotesk-700.woff2" },
    "ui": { "familia": "Inter", "peso": 500, "archivo": "assets/fonts/Inter-500.woff2" },
    "mono": { "familia": "JetBrains Mono", "peso": 500, "archivo": "assets/fonts/JetBrainsMono-500.woff2" }
  },
  "fondo": { "tipo": "puntos", "grano": false, "vineta": true },
  "tarjeta": { "estilo": "borde", "radio": 14 },
  "subtitulo": { "estilo": "caja", "mayusculas": false, "palabras": 3, "tamano": 68, "altura": 0.64 },
  "movimiento": "preciso",
  "firma": "Las cifras aparecen siempre en mono dentro de una caja con borde del acento."
}
```

Valores admitidos por `montar.mjs`:

- `tema`: `oscuro` | `claro` (solo afecta a sombras y a la viñeta).
- `fondo.tipo`: `liso` | `degradado` | `reticula` | `puntos` | `lineas`.
- `tarjeta.estilo`: `cristal` | `solida` | `borde` | `papel`.
- `subtitulo.estilo`: `pildora` | `color` | `subrayado` | `caja` | `resaltador`. `altura` es la posición vertical (0-1) del centro del subtítulo.
- `movimiento`: `suave` (entradas largas, sin rebote), `preciso` (rápido y seco, sin rebote) o `energico` (rápido, con un rebote ligero y más golpes de escala).
- `fuentes.firma` (opcional): una segunda fuente para una sola palabra por titular, marcada con `*asteriscos*` en el texto.

## 5. `identidad.md`

Resumen en prosa de media página: quién es, cómo quiere sonar y verse, la tabla de colores con su papel, las fuentes, la firma y la lista de "nunca". Añade al final una sección **"Aprendido en vídeos anteriores"** que se va llenando cuando algo funcione.
