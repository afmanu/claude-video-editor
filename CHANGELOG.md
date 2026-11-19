# Cambios

## v1.1 · 2026-11

**Prepara tu estilo antes de abrir Claude**

- Nuevo cuestionario `MI-ESTILO.md` para rellenar en 3 minutos (también impreso en la guía PDF). Claude lo lee y pregunta solo lo que falte.
- Referencias: deja 2 o 3 vídeos que te gusten en `mi-estilo/referencias/` y Claude mide su ritmo, gancho, subtítulos, gráficos y cierre para proponerte tu estilo (`references/referencias.md`, `scripts/referencias.mjs`). Se toman técnicas, nunca la marca de nadie.
- Vídeo objetivo: deja en `objetivo/` un vídeo al que quieras que se parezca uno tuyo. El storyboard lleva una columna "Del objetivo" con lo que se toma y de qué segundo.
- `scripts/doctor.mjs`: comprueba Node, ffmpeg, HyperFrames, Parakeet y el navegador, y dice cómo arreglar lo que falte.
- `scripts/empezar.mjs`: crea la carpeta de trabajo y la de cada vídeo (`brutos/`, `objetivo/`, `CAMBIOS.md`). No sobrescribe nada.
- Borradores con versión (`borrador-v01.mp4`, `-v02`…) y `CAMBIOS.md` por vídeo.
- La entrevista en el chat sigue funcionando igual para quien no quiera preparar nada.

**Correcciones de la prueba completa en Windows**

- Transcripción con Parakeet (entiende español y funciona en Windows); se instala sola si falta.
- `cortes.mjs`: detecta marcas de toma fallida ("otra", "repito") y arranques repetidos.
- `aroll.mjs`: compatible con ffmpeg 7 y posteriores.
- `exportar.mjs`: mide el volumen final y evita el desajuste de nivel H.264.
- `hoja.mjs`: hoja de cortes recortada a la cara.
- `montar.mjs`: placa detrás del texto en tema claro y subtítulo a 0,72 de altura por defecto.
- Bienvenida al instalar y sección "Mis preferencias" para cambiar cualquier regla.

## v1.0 · 2026-11-06

Primera versión pública.
