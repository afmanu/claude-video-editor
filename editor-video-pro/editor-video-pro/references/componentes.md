# Componentes: qué gráfico va en cada momento

Un **beat** es una idea que se explica. Para cada beat decides dos cosas: el **modo** (dónde está la persona) y el **componente** (qué gráfico demuestra la idea). Esa decisión se escribe en `beats.json` y la persona la revisa igual que revisa la lista de cortes.

## Cómo elegir

Lee la transcripción montada y pregúntate en cada frase: *¿qué podría enseñar en pantalla que pruebe esto?*

| Lo que dice la frase | Componente | Ejemplo |
|---|---|---|
| Una afirmación fuerte, el gancho o la idea central | `titular` | "Esto lo he editado *entero* con IA" |
| Varias cosas seguidas (pasos, ventajas, errores) | `lista` | "corta silencios, quita tomas, pone subtítulos" |
| Un número protagonista (tiempo, dinero, porcentaje) | `cifra` | "me ahorra dos horas por vídeo" |
| Lo que se le pide a una IA y lo que devuelve | `prompt` | "le dices: edita este vídeo… y te lo devuelve montado" |
| Antes contra después, lo viejo contra lo nuevo | `comparar` | "antes tardaba una tarde, ahora diez minutos" |
| Un proceso: entra algo, se transforma, sale un resultado | `flujo` | "subes el bruto, Claude lo procesa, sale el reel" |
| Hay grabación de pantalla o captura real | `pantalla` | la app funcionando |
| Momento personal, opinión o conexión | `ninguno` en modo `cara` | "yo prefiero revisarlo antes de publicar" |

Si dudas entre dos, elige el que **demuestra** más (una pantalla real gana a una lista; una cifra gana a un titular que dice la cifra).

## Modos

| Modo | Qué se ve | Cuándo |
|---|---|---|
| `cara` | La persona a pantalla completa; el gráfico, si lo hay, pequeño arriba | Gancho, opinión, cierre |
| `dividida` | Gráfico en la mitad de arriba, persona abajo | Explicar mientras se habla (el modo por defecto del cuerpo) |
| `grafico` | Solo el gráfico, con la voz en off | Planos héroe, cifras, o tapar un tramo donde la mirada se va |

Alterna modos para que haya algo nuevo cada pocos segundos, pero no cambies de modo en cada beat: dos o tres beats seguidos en `dividida` está bien.

## Reglas

- **Un protagonista por beat.** El siguiente entra cuando el anterior sale.
- **Sincronía:** `t` cae en la palabra que nombra la idea (0,2 s antes en los remates). Los ítems de `lista` y los pasos de `flujo` llevan su propio `t` con la palabra exacta.
- **Pocos efectos especiales:** como mucho 3-4 `titular` grande o `cifra` por reel, nunca dos seguidos.
- **Nada en la banda de subtítulos.** En `dividida`, los gráficos viven entre 250 y 820 px de alto.
- **Textos cortos:** 2-5 palabras por ítem o nodo. Si no cabe, sobra texto.
- **Callback:** si un elemento vuelve (la barra de prompt, el mismo flujo), repite el mismo componente con otro estado.

## `beats.json`

```json
{
  "formato": "reel",
  "duracion": 42.5,
  "aroll": { "src": "assets/aroll.mp4" },
  "enfasis": ["gratis", "10"],
  "beats": [
    { "t": 0, "modo": "cara", "tipo": "titular", "texto": "Esto lo he editado *entero* con IA" },
    { "t": 3.2, "modo": "dividida", "tipo": "prompt", "etiqueta": "Paso 1", "texto": "Edita este vídeo y quita los silencios", "resultado": "Vídeo montado en 2 min", "t_resultado": 7.4 },
    { "t": 10.8, "modo": "dividida", "tipo": "lista", "titulo": "Lo que hace *solo*", "items": [
      { "texto": "Corta silencios", "t": 11.2 },
      { "texto": "Quita tomas repetidas", "t": 12.1 },
      { "texto": "Pone subtítulos", "t": 13.0, "estado": "bien" } ] },
    { "t": 14.0, "modo": "grafico", "tipo": "cifra", "de": 0, "hasta": 120, "sufijo": " min", "texto": "ahorrados por vídeo" },
    { "t": 17.0, "modo": "dividida", "tipo": "comparar", "antes": { "items": ["Una tarde editando"] }, "despues": { "items": ["Diez minutos revisando"] }, "t_despues": 18.6 },
    { "t": 21.0, "modo": "dividida", "tipo": "flujo", "pasos": ["Vídeo en bruto", "Claude", "Reel listo"] },
    { "t": 25.0, "modo": "dividida", "tipo": "pantalla", "src": "assets/pantalla.mp4", "media_inicio": 3, "zoom": { "t": 27, "x": 0.7, "y": 0.3, "escala": 1.8 } },
    { "t": 36.0, "modo": "cara", "tipo": "ninguno" }
  ],
  "subtitulos": [["Esto", 0.1, 0.3], ["lo", 0.3, 0.42]]
}
```

Campos de cada componente:

| Componente | Campos |
|---|---|
| todos | `t`, `modo`, `tipo`, `etiqueta` (píldora opcional encima) |
| `titular` | `texto` (`*palabra*` va en la fuente firma o en el acento), `grande` (true para plano héroe), `tiempos` (opcional, uno por palabra) |
| `lista` | `titulo`, `items` (texto o `{ texto, t, estado: "bien" \| "mal" }`) |
| `cifra` | `de`, `hasta`, `prefijo`, `sufijo`, `decimales`, `texto` (debajo), `t_cuenta` |
| `prompt` | `texto`, `resultado`, `t_resultado`, `etiqueta_prompt` (por defecto "Prompt") |
| `comparar` | `antes` y `despues` (`{ titulo, items }`), `t_despues` |
| `flujo` | `pasos` (2-4; texto o `{ texto, t }`), `resultado: false` para no marcar el último en verde |
| `pantalla` | `src` (vídeo o imagen en `assets/`), `media_inicio`, `zoom: { t, x, y, escala }` |

`subtitulos` lo rellena `scripts/subtitulos.mjs`. `enfasis` son las palabras que van en el color de énfasis (cifras, palabras clave). Pon `"sfx": false` para montar sin efectos de sonido.

¿Necesitas un componente que no existe? Escríbelo como una función más dentro de `COMP` en `montar.mjs`, siguiendo el patrón de los demás (HTML + tweens en función del tiempo), y documéntalo aquí.
