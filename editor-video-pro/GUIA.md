# Editor de vídeo pro: cómo instalarlo y usarlo

Esta skill convierte a Claude en tu editor de vídeo: corta lo que sobra, pone subtítulos, diseña los gráficos y te enseña cada paso antes de darlo por bueno. Lo primero que hará es ayudarte a definir **tu** estilo visual, así que tus vídeos no se van a parecer a los de nadie.

## Antes de empezar: prepara tu estilo (opcional, 3 minutos)

Claude puede preguntarte por tu estilo en el chat, pero sale mejor y más rápido si llegas con esto:

1. **El cuestionario `MI-ESTILO.md`** (viene dentro de la skill y en la guía en PDF). Marca opciones y escribe lo que tengas claro; lo que dejes en blanco lo decide Claude y te lo dice.
2. **2 o 3 vídeos que te gusten** y que se parezcan entre sí. Claude mide su ritmo, cómo empiezan, cómo son sus subtítulos y cómo cierran, y lo traduce a tu estilo. Nunca se usan en tus vídeos ni se copia la marca de nadie.

Y para cada vídeo puedes darle un **vídeo objetivo**: uno concreto al que quieres que se parezca (estructura, ritmo, gancho y cierre).

Hay dos formas de usar la skill. Puedes empezar por la primera y pasar a la segunda cuando quieras.

## Opción A: en claude.ai (5 minutos, sin instalar nada)

Claude planifica la edición completa y tú la montas en tu editor de siempre (CapCut, Premiere, DaVinci…).

1. Entra en claude.ai → **Ajustes → Capacidades** y activa **Skills** (y "Ejecución de código" si te lo pide).
2. En la sección Skills, pulsa **Subir skill** y elige el archivo `editor-video-pro.zip` sin descomprimirlo.
3. Abre un chat (mejor dentro de un **Proyecto** para que recuerde tu estilo) y escribe:
   > Quiero editar mis vídeos con la skill editor-video-pro. Empecemos por mi identidad visual.

   Si has rellenado el cuestionario, pégalo en ese mismo mensaje. Si tienes referencias, sube 4-6 capturas de cada una (el primer segundo, un subtítulo, un gráfico y el cierre) y su enlace.
4. Cuando tengas tu identidad, Claude te dará `identidad.md`. Pégalo en las instrucciones del proyecto o súbelo como archivo del proyecto.
5. Para cada vídeo: exporta la transcripción desde tu editor (archivo `.srt`) y pásasela con el tema y la duración. Si quieres que se parezca a un vídeo concreto, añade su enlace y unas capturas. Te devolverá la lista de cortes, los subtítulos, el storyboard y los gráficos.

## Opción B: en Claude Code (el vídeo terminado, en tu ordenador)

Claude trabaja dentro de una carpeta de tu ordenador: transcribe, corta, subtitula, anima y te entrega el MP4 final.

### Lo que necesitas (todo gratis)

| Herramienta | Para qué | Cómo instalarla |
|---|---|---|
| Claude Code | El agente que edita | [claude.com/claude-code](https://claude.com/claude-code) |
| Node.js 20 o superior | Ejecutar los scripts y HyperFrames | [nodejs.org](https://nodejs.org) (versión LTS) |
| ffmpeg | Cortar y exportar vídeo | Windows: `winget install Gyan.FFmpeg` · Mac: `brew install ffmpeg` · Linux: `sudo apt install ffmpeg` |
| Google Chrome | HyperFrames lo usa para renderizar | Si no lo tienes: `npx hyperframes browser ensure` |

Después de instalar ffmpeg, cierra y abre la terminal. Comprueba que todo está con `node -v` y `ffmpeg -version` (o, ya con la skill instalada, pídele a Claude que ejecute `doctor.mjs`).

Por último, instala el modelo de transcripción (una sola vez, unos 640 MB; entiende español y funciona en Windows, Mac y Linux):

```
npx hyperframes models install parakeet
```

### Instalar la skill

1. Descomprime `editor-video-pro.zip`.
2. Copia la carpeta `editor-video-pro` a:
   - Windows: `C:\Users\<tu-usuario>\.claude\skills\`
   - Mac / Linux: `~/.claude/skills/`
3. Crea una carpeta de trabajo para tus vídeos (por ejemplo `Videos/estudio`), ábrela en la terminal y escribe `claude`.
4. Primer mensaje:
   > Usa la skill editor-video-pro. Comprueba mi equipo y prepara la carpeta.

   Claude ejecutará `doctor.mjs` (te dice qué falta instalar y cómo) y `empezar.mjs`, que crea `mi-estilo/` con el cuestionario y una carpeta `referencias/`.
5. Rellena `mi-estilo/MI-ESTILO.md`, deja tus vídeos de referencia en `mi-estilo/referencias/` y escribe:
   > Ya he rellenado mi estilo.

   ¿Prefieres no preparar nada? Escribe *"Primero definamos mi identidad visual"* y Claude te hará las preguntas en el chat.

### Tu primer vídeo

Pídele a Claude que cree la carpeta del vídeo (*"Prepara un vídeo nuevo que se llame mi-primer-reel"*). Mete el bruto en `mi-primer-reel/brutos/` y, si quieres, un vídeo a imitar en `mi-primer-reel/objetivo/`. Después:

> Edita mi-primer-reel/brutos/mi-video.mov como reel de 45 segundos. El tema es … y al final quiero pedir que me sigan.

Lo primero que hará Claude, nada más instalarla, es preguntarte por tu estilo (colores, tipografías, subtítulos…). **Todo lo que elijas se puede cambiar después**: basta con pedírselo ("subtítulos más grandes", "cambia el color", "sin efectos de sonido").

Claude te irá enseñando la lista de cortes, el storyboard, una vista previa y un borrador. Revisa cada paso y dile qué cambiar: no avanza sin tu visto bueno. Cada borrador se guarda como una versión nueva (`-v01`, `-v02`…) y `CAMBIOS.md` apunta qué cambió en cada una.

## Consejos para grabar mejor

- Empieza por la frase más potente ("Esto lo he editado entero con IA"), no por el saludo.
- Si te equivocas, repite la frase entera: Claude se queda con la última toma.
- Mira a cámara al terminar cada frase y deja medio segundo de silencio entre frases.
- Graba la pantalla con la grabadora del sistema (no filmes el monitor con el móvil).

## Licencias

Todo lo que usa la skill es gratuito y permite uso comercial: ffmpeg, HyperFrames, GSAP, fuentes de Google Fonts (OFL), iconos Lucide (ISC) y efectos de sonido de Pixabay. Si añades música, fuentes o imágenes por tu cuenta, comprueba que su licencia permite uso comercial.
