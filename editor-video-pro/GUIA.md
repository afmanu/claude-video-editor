# Editor de vídeo pro: cómo instalarlo y usarlo

Esta skill convierte a Claude en tu editor de vídeo: corta lo que sobra, pone subtítulos, diseña los gráficos y te enseña cada paso antes de darlo por bueno. Lo primero que hará es ayudarte a definir **tu** estilo visual, así que tus vídeos no se van a parecer a los de nadie.

Hay dos formas de usarla. Puedes empezar por la primera y pasar a la segunda cuando quieras.

## Opción A: en claude.ai (5 minutos, sin instalar nada)

Claude planifica la edición completa y tú la montas en tu editor de siempre (CapCut, Premiere, DaVinci…).

1. Entra en claude.ai → **Ajustes → Capacidades** y activa **Skills** (y "Ejecución de código" si te lo pide).
2. En la sección Skills, pulsa **Subir skill** y elige el archivo `editor-video-pro.zip` sin descomprimirlo.
3. Abre un chat (mejor dentro de un **Proyecto** para que recuerde tu estilo) y escribe:
   > Quiero editar mis vídeos con la skill editor-video-pro. Empecemos por mi identidad visual.
4. Cuando tengas tu identidad, Claude te dará `identidad.md`. Pégalo en las instrucciones del proyecto o súbelo como archivo del proyecto.
5. Para cada vídeo: exporta la transcripción desde tu editor (archivo `.srt`) y pásasela con el tema y la duración. Te devolverá la lista de cortes, los subtítulos, el storyboard y los gráficos.

## Opción B: en Claude Code (el vídeo terminado, en tu ordenador)

Claude trabaja dentro de una carpeta de tu ordenador: transcribe, corta, subtitula, anima y te entrega el MP4 final.

### Lo que necesitas (todo gratis)

| Herramienta | Para qué | Cómo instalarla |
|---|---|---|
| Claude Code | El agente que edita | [claude.com/claude-code](https://claude.com/claude-code) |
| Node.js 20 o superior | Ejecutar los scripts y HyperFrames | [nodejs.org](https://nodejs.org) (versión LTS) |
| ffmpeg | Cortar y exportar vídeo | Windows: `winget install Gyan.FFmpeg` · Mac: `brew install ffmpeg` · Linux: `sudo apt install ffmpeg` |
| Google Chrome | HyperFrames lo usa para renderizar | Si no lo tienes: `npx hyperframes browser ensure` |

Después de instalar ffmpeg, cierra y abre la terminal. Comprueba que todo está con `node -v` y `ffmpeg -version`.

### Instalar la skill

1. Descomprime `editor-video-pro.zip`.
2. Copia la carpeta `editor-video-pro` a:
   - Windows: `C:\Users\<tu-usuario>\.claude\skills\`
   - Mac / Linux: `~/.claude/skills/`
3. Crea una carpeta de trabajo para tus vídeos (por ejemplo `Videos/estudio`), ábrela en la terminal y escribe `claude`.
4. Primer mensaje:
   > Usa la skill editor-video-pro. Primero definamos mi identidad visual.

### Tu primer vídeo

Mete el vídeo en bruto en la carpeta y dile a Claude:

> Edita brutos/mi-video.mov como reel de 45 segundos. El tema es … y al final quiero pedir que me sigan.

Claude te irá enseñando la lista de cortes, el storyboard, una vista previa y un borrador. Revisa cada paso y dile qué cambiar: no avanza sin tu visto bueno.

## Consejos para grabar mejor

- Empieza por la frase más potente ("Esto lo he editado entero con IA"), no por el saludo.
- Si te equivocas, repite la frase entera: Claude se queda con la última toma.
- Mira a cámara al terminar cada frase y deja medio segundo de silencio entre frases.
- Graba la pantalla con la grabadora del sistema (no filmes el monitor con el móvil).

## Licencias

Todo lo que usa la skill es gratuito y permite uso comercial: ffmpeg, HyperFrames, GSAP, fuentes de Google Fonts (OFL), iconos Lucide (ISC) y efectos de sonido de Pixabay. Si añades música, fuentes o imágenes por tu cuenta, comprueba que su licencia permite uso comercial.
