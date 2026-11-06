# Editor de vídeo pro para Claude

Una skill en español para planificar y ejecutar ediciones de vídeo con un flujo profesional: selección de cortes, subtítulos, storyboard, motion graphics, revisión humana y exportación final.

El sistema trabaja con tu propia identidad visual. No impone una plantilla ni replica el estilo de otros creadores.

## Descargas

- [Descargar la skill en ZIP](./dist/editor-video-pro.zip?raw=1) — formato recomendado para subirla a Claude.
- [Descargar la skill con extensión `.skill`](./dist/editor-video-pro.skill?raw=1) — el mismo ZIP, útil para instalación manual y compatible con la guía visual.
- [Descargar la guía de instalación en PDF](./docs/guia-instalacion-editor-video-pro.pdf?raw=1).
- [Verificar las descargas con SHA-256](./SHA256SUMS).

> Claude está unificando Skills y Plugins. Según la cuenta, la opción puede aparecer en **Personalizar**, **Plugins** o **Skills**. La ruta actual es crear o añadir una skill y subir el archivo ZIP.

## Qué hace

- Define una identidad visual propia antes de editar.
- Detecta silencios, muletillas y tomas repetidas.
- Genera una lista de cortes para revisar antes del montaje.
- Produce subtítulos y un storyboard por bloques.
- Crea motion graphics con HyperFrames y GSAP.
- Renderiza un borrador y espera aprobación antes del vídeo final.
- Exporta en H.264 con audio normalizado a -14 LUFS.

## Dos formas de usarla

| Entorno | Resultado |
|---|---|
| Claude web o app | Plan de edición, cortes, subtítulos, storyboard y especificaciones gráficas para montar en tu editor. |
| Claude Code | Flujo local completo: transcripción, cortes, gráficos, revisiones y MP4 final. |

## Instalación rápida

### Claude web o app

1. Descarga [`editor-video-pro.zip`](./dist/editor-video-pro.zip?raw=1).
2. Abre la sección de Skills de Claude.
3. Crea una skill y sube el ZIP sin descomprimirlo.
4. Actívala y escribe:

   > Quiero editar mis vídeos con la skill editor-video-pro. Empecemos por mi identidad visual.

Consulta también la [documentación oficial de Skills de Claude](https://support.claude.com/es/articles/12512180-usar-habilidades-en-claude).

### Claude Code

Requisitos:

- Node.js 20 o superior.
- ffmpeg y ffprobe disponibles en el `PATH`.
- Google Chrome para las vistas previas y el render.
- Conexión a internet durante la primera descarga de HyperFrames y sus modelos.

Instalación personal:

1. Descarga y descomprime `editor-video-pro.zip`.
2. Copia la carpeta `editor-video-pro` resultante dentro de:
   - Windows: `C:\Users\<tu-usuario>\.claude\skills\`
   - macOS o Linux: `~/.claude/skills/`
3. Abre Claude Code en la carpeta de tu vídeo y escribe:

   > Usa la skill editor-video-pro. Primero definamos mi identidad visual.

También puedes incluirla en un proyecto compartido bajo `.claude/skills/editor-video-pro/`.

## Estructura del repositorio

```text
editor-video-pro/
  SKILL.md
  GUIA.md
  assets/
  references/
  scripts/
docs/
  guia-instalacion-editor-video-pro.pdf
dist/
  editor-video-pro.zip
  editor-video-pro.skill
```

`editor-video-pro/` contiene únicamente el código fuente de la skill. `docs/` reúne la documentación descargable y `dist/` los paquetes listos para instalar.

## Seguridad y privacidad

La skill ejecuta herramientas locales como `ffmpeg`, `ffprobe`, Node.js y `npx hyperframes`. Revisa cualquier skill de terceros antes de activarla y trabaja con copias de tus vídeos originales.

No publiques brutos, transcripciones, identidades visuales ni otros archivos con datos personales al informar de un problema.

## Contribuir

Consulta [CONTRIBUTING.md](./CONTRIBUTING.md) antes de proponer cambios.

## Licencia

Este repositorio se distribuye bajo la [licencia MIT](./LICENSE). Las herramientas y recursos de terceros conservan sus propias licencias.

Proyecto independiente, no afiliado ni respaldado por Anthropic.
