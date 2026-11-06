# Pipeline en Claude Code: del bruto al MP4

Todo se ejecuta desde la carpeta del proyecto del vídeo (una carpeta por vídeo). `<skill>` es la carpeta donde está instalada esta skill.

## Estructura de un proyecto

```
mi-reel/
  identidad.json, identidad.md   ← copia de la identidad de la persona (paso 0)
  beats.json                     ← storyboard: qué gráfico va en cada momento
  EDL.md                         ← lista de cortes para revisar
  index.html                     ← composición generada (no se edita a mano)
  assets/  bruto.json, transcript.json, piezas.json, aroll.mp4, cortes.json, fonts/, sfx/, gsap.min.js
  renders/ hoja.jpg, borrador.mp4
  entrega/ final.mp4
```

Primera vez en un proyecto: `npm init -y && npm i gsap` (así GSAP va en local y el render no depende de internet).

## 1. Preparar y transcribir

```bash
node <skill>/scripts/preparar.mjs ../brutos/mi-video.mov
```

- Detecta resolución, fps, duración y pistas de audio.
- **HDR del iPhone** (HEVC 10 bits, BT.2020): lo convierte a BT.709 cambiando **solo la gama de color**, sin tonemap. El tonemap quema o apaga la piel; reetiquetar sin convertir deja la imagen fría y desaturada.
- Extrae el audio a WAV mono de 16 kHz y transcribe con `npx hyperframes transcribe` (la primera vez descarga el modelo, unos cientos de MB).
- Lee el texto que imprime y **comprueba que el vídeo habla del tema del brief**. Si no, para y pregunta.

Trampas de la transcripción:
- Los tiempos de inicio pueden ir unas décimas adelantados y los finales alargarse hasta el siguiente silencio. No cortes solo con ellos: revisa las uniones.
- El modelo "completa" palabras cortadas por contexto. Si una frase acaba de forma rara, escúchala.
- Nombres propios mal escritos ("Cloud" por "Claude"): añádelos a `assets/correcciones.json` y se arreglan solos en los subtítulos.

## 2. Lista de cortes

```bash
node <skill>/scripts/cortes.mjs            # --silencio 0.35 por defecto
node <skill>/scripts/aroll.mjs             # monta una primera versión para poder mirarla
node <skill>/scripts/hoja.mjs              # renders/hoja.jpg: cada unión antes · durante · después
```

- `cortes.mjs` parte la voz en cada silencio, quita muletillas sueltas ("eh", "em"), tramos que son solo relleno ("bueno", "vale") y tomas repetidas (se queda la última).
- Mira `renders/hoja.jpg`: en cada fila, la persona debe mirar a cámara a ambos lados del corte, sin ojos cerrados ni giros de cabeza. Si no, ajusta `a`/`b` de esa pieza en `assets/piezas.json` o elige otra toma.
- Si la mirada se va a mitad de una frase que hay que conservar, apúntalo: ese tramo irá en modo `grafico` (voz en off).
- Enseña `EDL.md` con tu resumen (qué se quita y por qué) y espera la aprobación. Tras cada cambio en `piezas.json`, repite `aroll.mjs` y `hoja.mjs`.

## 3. A-roll

`aroll.mjs` monta un único `assets/aroll.mp4` con ffmpeg: cortes a fotograma exacto, fundido de audio de 15 ms en cada unión (evita clics), filtro de graves y normalización de volumen. Es más fiable que decenas de clips sueltos en la composición. También escribe `assets/cortes.json`, que `montar.mjs` usa para alternar el encuadre (punch-in) en cada corte.

La imagen de la persona no se toca: ni color, ni LUT, ni grano.

## 4. Subtítulos

```bash
node <skill>/scripts/subtitulos.mjs
```

Vuelve a transcribir el A-roll montado (tiempos exactos de la línea de tiempo final), aplica `assets/correcciones.json` y escribe la lista de palabras en `beats.json` → `subtitulos`, más un `subtitulos.srt` para YouTube u otros editores. Revisa el texto: tildes, nombres propios y signos de puntuación (los puntos y comas ayudan a partir bien los bloques).

## 5. Storyboard y montaje

1. Escribe los `beats` en `beats.json` siguiendo `componentes.md`. Enséñalos como tabla (tiempo · frase · modo · componente) y espera el visto bueno.
2. Copia `identidad.json` al proyecto y las fuentes que indica a `assets/fonts/` (descárgalas de Google Fonts en `.woff2`; si solo hay `.ttf`, también vale cambiando el `format`).
3. Efectos de sonido (opcionales): descarga de Pixabay los que quieras y guárdalos con estos nombres en `assets/sfx/`: `impacto.mp3`, `whoosh.mp3`, `pop.mp3`, `campana.mp3`, `teclado.mp3`. Los que falten se omiten.
4. Monta:

```bash
node <skill>/scripts/montar.mjs .
npx hyperframes lint .
npx hyperframes snapshot . --at 1.5,6,12,20     # un tiempo por beat, en su momento fuerte
```

Mira la hoja de snapshots de verdad: texto cortado, gráfico encima de la cara, subtítulo tapando algo, palabra activa equivocada. Corrige en `beats.json` (o en `identidad.json`) y vuelve a montar. **No edites `index.html` a mano**: se sobrescribe.

## 6. Vista previa, borrador y final

```bash
npx hyperframes preview .                        # vista previa en el navegador
npx hyperframes render . --quality draft -o renders/borrador.mp4
node <skill>/scripts/hoja.mjs renders/borrador.mp4 1.5 6 12 20
npx hyperframes render . --quality delivery -o renders/master.mp4
node <skill>/scripts/exportar.mjs renders/master.mp4 entrega/final.mp4
```

- La persona aprueba la vista previa antes del render y el borrador antes del final.
- `exportar.mjs` mide el volumen y lo deja en -14 LUFS con limitador (dos pasadas), H.264 a 14 Mbps, 30 fps y `faststart` para redes.

## 7. YouTube 16:9

`montar.mjs` está pensado para 9:16. Para YouTube: usa los pasos 1-4 igual, monta en tu editor con `aroll.mp4` y `subtitulos.srt`, y crea los gráficos de cada beat como composiciones cortas de HyperFrames a 1920×1080 que se insertan como clips.

## Problemas habituales

| Síntoma | Causa | Arreglo |
|---|---|---|
| `ffmpeg` no se encuentra | No está en el PATH | Reinstala o abre una terminal nueva (en Windows, winget no actualiza el PATH hasta reiniciar) |
| La transcripción falla | El modelo no se pudo descargar | Revisa la conexión y prueba `npx hyperframes transcribe assets/audio16k.wav --language es` |
| Fotogramas negros al final | Duración mal puesta | `duracion` en `beats.json` debe ser la del `aroll.mp4` (la escribe `subtitulos.mjs`) |
| Letras distintas a las elegidas | Faltan los `.woff2` | Comprueba las rutas `archivo` de `identidad.json` |
| El render tarda mucho | Normal en equipos modestos | Usa `--quality draft` para revisar y deja el final para cuando esté aprobado |
