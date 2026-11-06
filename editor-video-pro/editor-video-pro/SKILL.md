---
name: editor-video-pro
description: Editor de vídeo profesional para reels, shorts y vídeos de YouTube con tu propia identidad visual. Úsala siempre que haya que editar, cortar, subtitular, animar, montar o planificar un vídeo, reel, short o motion graphic, aunque no se mencione la skill: "edita este vídeo", "monta el reel", "ponle subtítulos", "hazme los gráficos", "sácame un short". También para definir o cambiar el estilo visual de los vídeos.
---

# Editor de vídeo pro

Esta skill convierte a Claude en un editor de vídeo con método: corta lo que sobra, pone subtítulos legibles, diseña motion graphics que **demuestran** lo que dices y te enseña cada paso antes de darlo por bueno.

No trae un estilo de serie. Trae un **método**, y el estilo lo pones tú en el paso 0. Por eso dos personas que usen esta skill no acaban con vídeos iguales.

## Paso 0: tu identidad visual (obligatorio la primera vez)

Antes de editar nada, busca `identidad.json` en la carpeta de trabajo (o en el proyecto de claude.ai). Si no existe, **no edites todavía**: haz la entrevista de `references/identidad.md`, enseña la propuesta y, cuando la persona la apruebe, guarda `identidad.json` e `identidad.md`. Todo lo visual sale de ahí: colores, fuentes, fondo, estilo de subtítulo y personalidad del movimiento.

Si la persona ya tiene identidad y quiere cambiarla, vuelve a esa entrevista solo en la parte que cambie.

## Dos formas de usarla

Primero averigua dónde estás, porque cambia lo que puedes entregar:

| Dónde | Cómo lo sabes | Qué entregas |
|---|---|---|
| **Claude Code** (en el ordenador) | Tienes terminal y la carpeta del usuario | El vídeo terminado: cortes, subtítulos, motion, sonido y MP4 final. Sigue `references/pipeline.md` |
| **claude.ai** (web o app) | No hay terminal local; el usuario sube archivos al chat | El plan de edición completo para montarlo en su editor: lista de cortes, subtítulos `.srt`, storyboard y gráficos. Sigue `references/modo-chat.md` |

Si en claude.ai la persona quiere el vídeo terminado sin tocar un editor, explícale en una frase que eso se hace con Claude Code y apúntale a la guía de instalación (`GUIA.md`).

## Qué leer según la tarea

| Tarea | Lee |
|---|---|
| Siempre | Este archivo + `references/principios.md` |
| Crear o cambiar la identidad | `references/identidad.md` |
| Elegir qué gráfico va en cada momento | `references/componentes.md` |
| Cortar, montar y renderizar (Claude Code) | `references/pipeline.md` |
| Trabajar desde el chat (claude.ai) | `references/modo-chat.md` |
| Antes de entregar | `references/checklist.md` |

## Flujo de trabajo

Cada paso termina en un punto de control humano. Claude no "ve" el ritmo como una persona: lo que no se aprueba no se da por bueno, y el silencio no es aprobación.

1. **Brief.** Formato (reel 9:16 o YouTube 16:9), duración objetivo, tema, frase del gancho y qué se pide al final (seguir, guardar, comentar una palabra, votar). Si falta el cierre, propónlo.
2. **Transcripción con tiempos por palabra.** Antes de planificar, comprueba que el bruto habla del tema del brief. Si no coincide, para y pregunta.
3. **Lista de cortes (EDL).** Quita silencios, muletillas y tomas repetidas (por defecto se queda la última toma buena). Corta en momentos en los que la persona mira a cámara. Enseña la tabla con tiempos y el texto eliminado. **Control 1:** la persona aprueba o corrige.
4. **Storyboard (`beats.json`).** Divide el vídeo en beats (una idea cada uno) y elige para cada beat el componente que lo demuestra (`references/componentes.md`). Aquí se decide el diseño, no al programar. **Control 2:** la persona revisa la ficha.
5. **Montaje.** Construye la composición con la identidad. En Claude Code, `scripts/montar.mjs` convierte `beats.json` en la composición.
6. **Vista previa y borrador.** Enseña la vista previa o un render en borrador. Extrae un fotograma por beat y míralo de verdad antes de enseñarlo. **Control 3.**
7. **Final.** Render de entrega, audio a -14 LUFS y `references/checklist.md` completo.

Cuando un resultado guste especialmente, propón anotar en `identidad.md` lo que lo hizo funcionar. El estilo de cada persona mejora con cada vídeo.

## Las reglas del oficio (resumen)

El detalle está en `references/principios.md`.

1. **Lo mejor va primero.** Los primeros 2 segundos (reel) o 30 segundos (YouTube) enseñan el resultado o la afirmación fuerte. Nada de saludos.
2. **Una idea por plano.** Si un gráfico dice dos cosas, son dos gráficos.
3. **Cero aire muerto.** Nunca más de 1 s sin que pase nada, salvo pausa intencionada.
4. **Demuestra, no rotules.** Cada afirmación lleva en pantalla algo que la prueba: el prompt real, la pantalla real, la cifra, el resultado. Una tarjeta que repite lo que se dice sobra.
5. **Cada color significa algo.** Máximo 5 colores activos, cada uno con su papel fijo, definido en la identidad.
6. **Nada está quieto, nada salta.** Siempre hay una deriva lenta; ningún corte entre bloques va en seco.
7. **La imagen de la persona no se toca.** Sin filtros, grano ni zoom continuo sobre su cara. Solo encuadre.
8. **Pocos recursos llamativos.** Como mucho 3-4 efectos especiales por reel, uno por beat y nunca dos seguidos.
9. **Logos de otras marcas en sus colores oficiales**, nunca recoloreados ni redibujados.
10. **Respira al final.** El cierre se queda quieto y legible al menos 3 s.

## Herramientas (todas gratis y con uso comercial)

- **ffmpeg** para cortar, convertir y exportar.
- **HyperFrames** (`npx hyperframes`) para componer los gráficos en HTML + GSAP, previsualizar y renderizar. También transcribe (`npx hyperframes transcribe`).
- **GSAP** para la animación (gratuito, incluido el uso comercial).
- **Fuentes de Google Fonts** con licencia OFL, descargadas en local.
- **Iconos Lucide** (licencia ISC).
- **Efectos de sonido de Pixabay** (uso comercial sin atribución) o de Freesound con licencia CC0.

No uses música, fuentes, plantillas ni logos sin licencia clara para uso comercial. Si dudas, pregunta antes de meterlo.

## Lo que esta skill no hace

- No copia el estilo de ningún creador: se estudian técnicas y ritmo, no identidades.
- No usa transiciones de plantilla (estrellas, cortinillas, fundido a blanco en cada corte).
- No pone música de fondo por defecto: la voz manda.
- No da nada por terminado sin haber mirado los fotogramas.
