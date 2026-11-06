# Contribuir

Gracias por ayudar a mejorar Editor de vídeo pro.

## Antes de abrir un cambio

- Mantén cada propuesta centrada en un problema concreto.
- Explica qué comportamiento cambia y cómo lo has comprobado.
- No incluyas vídeos, audios, transcripciones, identidades ni credenciales personales.
- Conserva las instrucciones y los ejemplos en español claro.

## Comprobaciones mínimas

Si modificas los scripts, valida su sintaxis:

```bash
for file in editor-video-pro/editor-video-pro/scripts/*.mjs; do node --check "$file"; done
```

Si modificas la instalación o los requisitos, actualiza también el README, `GUIA.md` y la guía visual cuando corresponda.

## Informar de un problema

Incluye:

- Sistema operativo.
- Versiones de Node.js, ffmpeg y Claude Code.
- Comando ejecutado.
- Resultado esperado y resultado obtenido.
- Fragmento mínimo del error, sin rutas privadas ni datos personales.
