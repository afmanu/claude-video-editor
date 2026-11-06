# Checklist antes de entregar

Que el lint pase no significa que el vídeo funcione. No digas que algo está terminado sin haber mirado los fotogramas.

## Contenido y ritmo
- [ ] La primera frase es la afirmación con resultado, no el contexto, y hay texto en pantalla desde el primer fotograma.
- [ ] Hay una prueba visual en los 2 primeros segundos.
- [ ] Se han quitado silencios, muletillas y tomas repetidas, y la persona ha aprobado la lista de cortes.
- [ ] En cada corte la persona mira a cámara (revisado con la hoja de fotogramas).
- [ ] Ninguna última palabra queda cortada (escuchado en el borrador).
- [ ] Algo nuevo cada 1-3 s y ningún tramo de más de 1 s sin que pase nada.
- [ ] Cada plano expresa una sola idea y cada gráfico demuestra, no repite.
- [ ] Hay al menos un callback (un elemento que vuelve con otro estado).
- [ ] El cierre se mantiene quieto y legible al menos 3 s y coincide con lo que se dice.

## Visual
- [ ] Todo sale de `identidad.json`: colores con su papel, fuentes, fondo, subtítulo, movimiento.
- [ ] Máximo 5 colores activos y cada uno significa algo.
- [ ] Nada importante en las zonas de interfaz (250 px arriba, 380 px abajo, 140 px a la derecha).
- [ ] Ningún texto por debajo de los mínimos de `principios.md` § 6; todo se lee en la hoja de snapshots sin zoom.
- [ ] Los subtítulos marcan la palabra correcta en el instante correcto y no tapan gráficos ni la cara.
- [ ] La imagen de la persona está como en el bruto: sin filtros, sin grano, sin zoom continuo.
- [ ] Logos de terceros en sus colores oficiales, sin redibujar.
- [ ] Todo lo que aparece (fuentes, efectos, música, imágenes) tiene licencia de uso comercial.

## Técnico
- [ ] `npx hyperframes lint .` sin errores.
- [ ] Sin fotogramas negros al final (la duración coincide con el A-roll).
- [ ] Fuentes en local, sin cargas desde internet durante el render.
- [ ] Audio final a -14 LUFS con picos por debajo de -1 dB (`exportar.mjs`).
- [ ] Exportación con los ajustes de su formato (`principios.md` § 10).

## Las 5 preguntas finales
1. ¿Podría cortar este plano a la mitad? Si sí, córtalo.
2. ¿Este color significa algo? Si no, quítalo.
3. ¿Se mueve algo en este plano? Si no, añade deriva.
4. ¿Dónde descansa el espectador? Si no hay respiro, créalo.
5. ¿Se entiende sin sonido? Si no, falta texto en pantalla.
