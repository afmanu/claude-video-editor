# Referencias y vídeo objetivo

Dos formas de enseñarle a Claude lo que te gusta con vídeos de verdad, en vez de describirlo:

| | Referencias | Vídeo objetivo |
|---|---|---|
| Para qué | Definir o afinar **tu estilo** (paso 0) | Que **un vídeo concreto** se parezca a otro |
| Cuántos | 2 o 3 parecidos entre sí | Uno |
| Dónde (Claude Code) | `mi-estilo/referencias/` | `<tu-video>/objetivo/` |
| Dónde (claude.ai) | Capturas y enlaces en el chat | Capturas y enlace en el chat |
| Qué sale | `mi-estilo/ANALISIS.md` → propuestas para `identidad.md` | `objetivo/OBJETIVO.md` → columna "Del objetivo" en el storyboard |

## Límites (siempre)

- **Nunca entran en el montaje**: ni un fotograma, ni su audio, ni sus gráficos.
- **No se copia la identidad de nadie**: nombre, cara, frases, paleta exacta, tipografía, logo ni marca. Se toman técnicas y ritmo y se traducen a la identidad de la persona.
- **No se descarga nada de redes** desde la skill. La persona trae sus propios archivos (o capturas) y es responsable de tener derecho a usarlos para estudiarlos.
- **Nada se escribe en `identidad.md` sin aprobación.** Claude propone el cambio exacto y espera; el silencio no cuenta.

## 1. Parte mecánica (Claude Code)

Desde la carpeta de trabajo:

```bash
node <skill>/scripts/referencias.mjs mi-estilo/referencias        # estilo
node <skill>/scripts/referencias.mjs mi-video/objetivo             # objetivo de un vídeo
# --idioma en  si los vídeos están en inglés
```

Si un vídeo no trae sonido, deja el audio al lado como `<nombre>.audio.m4a` y el script lo usa. Por cada vídeo deja en `<carpeta>/_datos/<nombre>/`:

| Archivo | Qué es |
|---|---|
| `info.json` | Duración, tamaño, fps, HDR, audio |
| `cortes.json` | Cortes por detección de escena y cortes por minuto |
| `hoja-NN.jpg` | Un fotograma por plano, rotulado con su segundo |
| `ritmo-NN.jpg` | Un fotograma por segundo (10×6). **Mírala siempre**: los jump cuts en el mismo fondo casi no cambian la escena y la detección se los salta |
| `hook.jpg` | Primeros 3 s, un fotograma cada 0,5 s |
| `final.jpg` | Últimos 6 s, uno por segundo (el cierre) |
| `transcript.json` | Transcripción por palabra con Parakeet, en local |
| `resumen.json` | Duración, planos, cortes/min, plano medio, palabras/min, volumen (LUFS), texto de los 3 primeros y de los 6 últimos segundos |

Trampas: los cortes por minuto son una **cota baja**. La transcripción de un vídeo ya montado (con música o efectos) se equivoca más: no cites frases sin escucharlas.

## 1 bis. En claude.ai

No se pueden analizar vídeos. Pide a la persona, por cada referencia: 4-6 capturas (el primer segundo, un subtítulo, un gráfico, el cierre), el enlace y qué le gusta. Si tiene el texto o los subtítulos, mejor. Trabaja igual que abajo, pero con la prueba "captura N" en lugar de `archivo @ segundo`, y avisa de que el ritmo es una estimación.

## 2. Mirar y medir

Con las hojas, `hook.jpg`, `final.jpg` y la transcripción, anota por referencia:

- **Ritmo:** duración, cortes/min, palabras/min, cuánto dura cada gráfico.
- **Gancho (0-3 s):** primera frase, texto en pantalla, si se ve el resultado o la herramienta desde el primer fotograma.
- **Subtítulos:** tipo de letra (gruesa, fina, con serifa), posición, palabras por bloque, cómo se resalta la palabra activa.
- **Gráficos:** qué tipo (tarjeta, captura real, cifra, lista…), dónde y cuánto duran; si demuestran o solo rotulan.
- **Encuadre:** cara completa, pantalla dividida o gráfico a pantalla completa, y cómo pasa de uno a otro.
- **Sonido:** volumen, efectos audibles, si hay música.
- **Cierre:** qué pide, cuánto se mantiene, cómo se escenifica.

## 3. Referencias de estilo → `mi-estilo/ANALISIS.md`

Cada conclusión es una regla corta con su prueba:

| Campo | Contenido |
|---|---|
| Regla | Qué hacer, en imperativo |
| Prueba | `archivo @ segundo` de cada referencia donde se ve (p. ej. `ref1 @ 0,0 · ref3 @ 0,5`) |
| Marca | **PATRÓN** si aparece en 2 o más referencias · **PUNTUAL** si solo en una |
| Frente a la skill | **Ya está** (cita dónde) · **Nueva** · **Contradice** (cita la regla) |
| Propuesta | Nada, añadir a `identidad.md`, ajustar `identidad.json` o descartar |

Reglas de decisión:

- Lo **PUNTUAL** no se propone como regla general: como mucho, como recurso para un momento concreto.
- Lo que choca con las reglas del oficio que protegen a la persona (tocar su imagen con filtros o zoom continuo, recolorear logos de otras marcas, copiar una identidad) se descarta y se dice por qué.
- Lo que choca con una regla por defecto que no es de ese tipo (duración, tamaño de subtítulo, energía) se plantea como pregunta.
- **Solo se pregunta donde las referencias se contradicen entre sí** o chocan con algo que la persona dijo en `MI-ESTILO.md`. Lo demás se resuelve con la tabla.

Plantilla:

```markdown
# Análisis de referencias
Fecha · referencias (archivo, duración, cortes/min, palabras/min, LUFS)

## Medidas
Una fila por referencia.

## Reglas
| # | Regla | Prueba | Marca | Frente a la skill | Propuesta |

## Descartadas
Regla · por qué.

## Preguntas
Solo contradicciones.
```

**En el paso 0** (sin identidad todavía), los PATRONES alimentan las tres direcciones: ritmo y energía → `movimiento`; subtítulos → `subtitulo`; tipo de gráfico y fondo → `tarjeta` y `fondo`. Cada dirección dice qué patrones recoge. La paleta y las fuentes salen de la persona (su marca o `MI-ESTILO.md`), nunca de la referencia.

**Con identidad ya hecha**, enseña `ANALISIS.md` y el cambio exacto a `identidad.md`/`identidad.json`. Lo aprobado se anota con fecha y origen al final de la regla: `(19-11-2026, referencias: ref1 @ 0,0 · ref3 @ 0,5)`.

## 4. Vídeo objetivo → `objetivo/OBJETIVO.md`

El objetivo se imita **en ese vídeo**: estructura, ritmo, tipo de gancho y de cierre. Orden de prioridad cuando chocan:

1. Las reglas del oficio que protegen a la persona (`principios.md`) y su lista de "nunca".
2. El objetivo.
3. La identidad de la persona.
4. Las referencias de estilo.

La duración sigue el brief aunque el objetivo dure otra cosa: se escala la estructura, no el ritmo.

```markdown
# Objetivo · <archivo>
Duración · cortes/min (cota baja) · palabras/min · LUFS · plano medio

## Estructura
| Beat | Tiempo | Frase (resumen) | Función (gancho, contexto, cuerpo, giro, cierre) | Encuadre | Gráfico | Transición |

## Gancho (0-3 s)
## Cierre
## Qué se toma y qué no
| Rasgo | Se toma | Motivo |
```

Los gráficos del objetivo se traducen a los de `componentes.md`: se toma la **función** (una lista que se rellena con la voz, una captura que demuestra), no su aspecto.

## 5. Storyboard con columna "Del objetivo"

Si hay objetivo, el storyboard que se enseña en el control 2 lleva una columna más:

| Beat | Tiempo | Frase | Modo | Componente | **Del objetivo** |
|---|---|---|---|---|---|
| 1 | 0-3 s | … | cara | titular | Gancho con pregunta y el resultado en el primer fotograma (objetivo @ 0,0) |
| 4 | 20-28 s | … | dividida | lista | Lista que se rellena ítem a ítem (objetivo @ 23,0). **Descartado:** zoom continuo sobre la cara (regla 7) |

"Del objetivo" dice qué se toma y de qué segundo, o "nada". Si se descarta algo, dice qué y por qué.
