// Paso 3: monta el A-roll (la voz y la imagen de la persona) a partir de assets/piezas.json.
// Cada unión lleva un fundido de audio de 15 ms (evita clics). La imagen no se toca: sin filtros ni etalonaje.
// Uso: node aroll.mjs   → assets/aroll.mp4 + assets/cortes.json (instantes de cada corte, para el punch-in alterno)
import { leer, guardar, ff, r3 } from "./comun.mjs";

const bruto = leer("assets/bruto.json");
const piezas = leer("assets/piezas.json");
const fps = Math.round(bruto.fps) || 30;
const q = (t) => Math.round(t * fps) / fps; // cortes a fotograma exacto
const FADE = 0.015;
const fil = [];
let acum = 0;
const cortes = [];
piezas.forEach((p, k) => {
  const a = q(p.a), b = q(p.b), d = r3(b - a);
  fil.push(`[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS[v${k}]`);
  fil.push(`[0:a:0]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS,afade=t=in:d=${FADE},afade=t=out:st=${r3(Math.max(0, d - FADE))}:d=${FADE}[a${k}]`);
  if (k) cortes.push(r3(acum));
  acum += d;
});
fil.push(`${piezas.map((_, k) => `[v${k}][a${k}]`).join("")}concat=n=${piezas.length}:v=1:a=1[vc][ac]`);
fil.push(`[ac]highpass=f=80,loudnorm=I=-14:TP=-1.5:LRA=11[ao]`);
guardar("assets/.aroll-filtro.txt", fil.join(";\n"));
console.log(`Montando ${piezas.length} piezas (${acum.toFixed(1)} s)…`);
ff(["-i", bruto.ruta, "-filter_complex_script", "assets/.aroll-filtro.txt", "-map", "[vc]", "-map", "[ao]", "-r", String(fps),
  "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "assets/aroll.mp4"]);
guardar("assets/cortes.json", cortes);
console.log(`assets/aroll.mp4 · ${acum.toFixed(2)} s · ${cortes.length} cortes`);
