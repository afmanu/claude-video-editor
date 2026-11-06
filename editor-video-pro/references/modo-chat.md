# Modo chat (claude.ai): el plan de edición

En claude.ai no hay terminal en el ordenador de la persona ni herramientas de render, y los brutos suelen pesar demasiado para subirlos. Aquí Claude hace de **editor jefe**: decide todo y entrega piezas listas para montar en cualquier editor (CapCut, Premiere, DaVinci, Final Cut…).

## Qué pedir a la persona

1. **La transcripción con tiempos.** La mayoría de editores la exportan (CapCut: subtítulos automáticos → exportar `.srt`; Premiere y DaVinci: transcripción → exportar). Si no puede, que suba solo el audio (`.mp3`) si cabe, o un `.srt` de cualquier herramienta gratuita.
2. **El brief** (formato, duración, tema, cierre) y su `identidad.md`. Si no tiene identidad, haz el paso 0 primero.
3. **Opcional:** capturas de pantalla del vídeo en momentos dudosos, para revisar encuadre o mirada.

Si el entorno de claude.ai permite ejecutar código y el archivo cabe, puedes procesar audio o clips cortos con las herramientas disponibles; compruébalo antes de prometerlo.

## Qué entregas

1. **Lista de cortes** en tabla: `#`, desde, hasta, texto, decisión (mantener / quitar: silencio, muletilla, toma repetida). Con los mismos criterios de `cortes.mjs`: silencios de más de 0,35 s, muletillas, última toma buena. Añade la duración final estimada. Recuérdale que revise la mirada en cada corte.
2. **Subtítulos `.srt`** ya corregidos (tildes, nombres propios), en bloques de 2-4 palabras y con los tiempos del vídeo **ya cortado**. Si aún no lo ha cortado, entrégalos después de que te pase la nueva transcripción.
3. **Storyboard** en tabla: tiempo, frase, modo (cara / dividida / gráfico), componente (`componentes.md`), texto exacto que va en pantalla y efecto de sonido.
4. **Gráficos.** Para cada beat con componente, una de estas opciones (pregunta cuál prefiere):
   - **Especificación** para hacerlo en su editor: textos, colores en hex de su identidad, fuente, tamaño, posición, entrada y duración.
   - **Animación en HTML** (un Artifact o archivo `.html` por gráfico, 1080×1920, fondo de su identidad, en bucle de 2-4 s) que puede grabar con la grabadora de pantalla o exportar con HyperFrames si un día pasa a Claude Code.
5. **Checklist de montaje** adaptada a su editor: orden de pistas, volumen de la voz a -14 LUFS, efectos a 0,12-0,3 y exportación (`principios.md` § 10).

## Cuándo recomendar Claude Code

Si la persona edita a menudo, quiere el vídeo terminado sin tocar el editor o quiere gráficos animados de verdad, explícale en una frase que con Claude Code esta misma skill corta, subtitula, anima y renderiza el MP4 en su ordenador, y apúntale a la guía de instalación.
