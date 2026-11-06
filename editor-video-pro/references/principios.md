# Principios de edición

Valen para cualquier identidad. Explican el porqué de cada decisión.

## 1. Estructura

### Reel / Short / TikTok (9:16, 30-60 s)

| Tramo | Tiempo | Qué pasa |
|---|---|---|
| Gancho | 0-3 s | La afirmación con resultado en la primera frase, con texto en pantalla desde el primer fotograma y una prueba visual en los 2 primeros segundos |
| Contexto | 3-8 s | Por qué importa y contra qué se compara (hacerlo a mano, otra herramienta, lo que hace todo el mundo) |
| Cuerpo | 8-40 s | Tres bloques, cada uno con un gráfico que demuestra. Sin contadores tipo "1/3" en pantalla: la regla de tres se nota en la estructura |
| Opinión | antes del cierre | La postura propia de la persona: es lo que la diferencia |
| Cierre | últimos 4-8 s | Lo que se pide (seguir, guardar, comentar una palabra, votar), escenificado y quieto al menos 3 s |

Si el bruto empieza por el contexto ("llevo tiempo probando…"), reordena para que el gancho vaya primero.

### YouTube (16:9, 8-15 min)

- Los 30 primeros segundos: resultado o promesa, y qué va a ver.
- Capítulos claros; cada 60-90 s, un cambio de ritmo (gráfico a pantalla completa, cambio de encuadre, pantalla grabada).
- Gráficos de 3-6 s (más pausados que en reels), pero siempre con algo en movimiento.
- Subtítulos completos como archivo `.srt` aparte; en pantalla, solo palabras clave.

## 2. Ritmo

- Quita silencios de más de 0,35 s, muletillas de relleno ("eh", "o sea", "bueno", "vale") y tomas repetidas (por defecto, la última buena).
- En reels, algo nuevo cada 1-3 s: una capa, un cambio de estado, un punch-in, un cambio de color.
- Cada 7-8 s de densidad, un respiro de 1 s.
- Alterna el encuadre en los cortes de la cara (normal / punch-in de 1,10-1,15) para que parezcan dos cámaras.
- Los gráficos entran en la palabra que los nombra; en los remates, 0,2 s antes.

## 3. Cortes y mirada

- Corta en fotogramas en los que la persona mira a cámara. En pantalla nunca debe verse una mirada perdida, ojos cerrados o un giro de cabeza a mitad de unión.
- Al terminar una frase la gente suele mirar a un lado: mide dónde acaba de verdad la voz (la última consonante suena floja) y corta justo después.
- Si la mirada se va a mitad de frase, tapa ese tramo con un gráfico a pantalla completa y la voz en off.
- Revisa cada unión con una hoja de fotogramas (`scripts/hoja.mjs`), nunca a ciegas.

## 4. La imagen de la persona

- No se toca: sin filtros, LUT, grano, viñeta ni zoom continuo sobre la cara. Solo encuadre y punch-in en los cortes.
- Vídeo HDR del iPhone (HEVC 10 bits, BT.2020): convierte solo la gama de color a BT.709, sin tonemap (`pipeline.md` § 1). El tonemap quema o apaga la piel.
- La textura (grano, viñeta, retícula) va solo en el fondo de los gráficos.

## 5. Gráficos

- **Demuestra, no rotules.** El prompt real, la pantalla real, la cifra que cambia, el antes y el después. Si el gráfico solo repite la frase, quítalo.
- **Un protagonista por beat.** El anterior sale (o muta) antes de que entre el siguiente.
- **Elemento que muta.** Si dos estados son pasos del mismo proceso (prompt → resultado), es el mismo elemento el que cambia de tamaño y contenido; no sale uno y entra otro. Así se entiende la continuidad.
- **Callback.** Un elemento vuelve 2-3 veces y cambia de estado cada vez. Da cohesión.
- **Grabaciones de pantalla limpias**, dentro de una tarjeta, nunca el monitor filmado con el móvil.
- **Logos de terceros** en sus colores oficiales; si son monocromos, en blanco sobre fondo oscuro o negro sobre fondo claro.
- **Datos reales** siempre que existan; si son ilustrativos, que se note.

## 6. Tipografía y tamaños (lienzo de 1080×1920)

En el móvil el vídeo se ve a un tercio de su tamaño. Mínimos:

| Elemento | Mínimo |
|---|---|
| Titular | 64 px |
| Palabra de golpe / plano héroe | 104 px |
| Subtítulos | 64-72 px |
| Texto de tarjetas y listas | 46 px |
| Etiquetas y texto secundario | 40 px |
| Nada | por debajo de 32 px |

- Revela el texto palabra a palabra, nunca letra a letra.
- Mayúsculas solo en 1-2 palabras de golpe, salvo que la identidad diga lo contrario.
- Si no se lee en una miniatura de 270 px de ancho, sobra texto o falta tamaño. Antes de reducir, quita.

## 7. Subtítulos

- Obligatorios en reels: la mayoría los ve sin sonido.
- De 2 a 4 palabras por bloque, cortando por unidad de sentido (no separes artículo y sustantivo).
- La palabra que se pronuncia se marca en su instante exacto, con el estilo de la identidad.
- Cifras y palabras clave con el color `enfasis`.
- **Zonas seguras** de Instagram y TikTok: nada importante en los 250 px de arriba, los 380 px de abajo ni los 140 px de la derecha.

## 8. Movimiento

- Declara siempre ease y duración. Entradas de 0,2-0,5 s, salidas de 0,2-0,3 s.
- Evita los rebotes exagerados, las explosiones de partículas, los brillos decorativos y todo lo que parezca plantilla.
- Transiciones entre bloques: barrido con desenfoque de movimiento, destello de luz, cambio de color de la misma composición o zoom a través del texto.
- Una cámara virtual muy lenta sobre los gráficos (1,00 → 1,04) evita que algo quede muerto.
- En HyperFrames anima `x`, `y`, `scale` y `opacity`, nunca `top` o `left`.

## 9. Sonido

| Capa | Volumen | Nota |
|---|---|---|
| Voz | 1,0 | Manda. -14 LUFS integrados, picos por debajo de -1 dBTP |
| Música | 0,10-0,15 | Opcional y sin letra. En reels, por defecto no hay |
| Efectos | 0,12-0,30 | Unos 12-16 en un reel de 50 s como techo |

Mapa básico de efectos:

| Momento | Efecto |
|---|---|
| Primer fotograma | golpe grave suave |
| Cambio de bloque | whoosh, 0,2 s antes del corte |
| Entra un elemento de lista | pop |
| Resultado o "funciona" | campanita |
| Clic del puntero | clic |
| Se escribe un prompt | teclado |

No pongas efectos en cada subtítulo. La cola de cada efecto puede entrar en el plano siguiente.

## 10. Exportación

| Formato | Ajustes |
|---|---|
| Reel / Short | H.264, 1080×1920, 30 fps, 12-16 Mbps, AAC 192 kbps, -14 LUFS |
| YouTube | H.264, 1920×1080 (o 4K), 30 fps, 16-20 Mbps, AAC 192 kbps, -14 LUFS |
