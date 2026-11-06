// Hoja de fotogramas para revisar a ojo: cada unión (justo antes y justo después del corte) o cada beat.
// Uso: node hoja.mjs [video=assets/aroll.mp4] [t1 t2 …]   (sin tiempos usa assets/cortes.json)
// Escribe renders/hoja.jpg: una fila por tiempo con 3 fotogramas (t-0,15 · t · t+0,15).
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { ff, leer, probe } from "./comun.mjs";

const args = process.argv.slice(2);
const video = args[0] && !/^[\d.]+$/.test(args[0]) ? args.shift() : "assets/aroll.mp4";
const tiempos = args.length ? args.map(Number) : existsSync("assets/cortes.json") ? leer("assets/cortes.json") : [];
if (!tiempos.length) throw new Error("Sin tiempos: pásalos como argumentos o genera antes assets/cortes.json con aroll.mjs");
const { dur, w, h } = probe(video);
const tmp = "renders/.hoja";
rmSync(tmp, { recursive: true, force: true });
mkdirSync(tmp, { recursive: true });
let n = 0;
tiempos.forEach((t) => [-0.15, 0, 0.15].forEach((d) => {
  const s = Math.min(Math.max(0, t + d), dur - 0.05);
  ff(["-ss", String(s), "-i", video, "-frames:v", "1", "-vf", `scale=${w > h ? 480 : 270}:-2`, `${tmp}/f${String(n++).padStart(4, "0")}.jpg`]);
}));
ff(["-framerate", "1", "-i", `${tmp}/f%04d.jpg`, "-vf", `tile=3x${tiempos.length}:padding=6:color=black`, "-frames:v", "1", "renders/hoja.jpg"]);
rmSync(tmp, { recursive: true, force: true });
console.log(`renders/hoja.jpg · ${tiempos.length} filas (${tiempos.map((t) => t.toFixed(2)).join(", ")})`);
