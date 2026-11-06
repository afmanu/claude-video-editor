// Paso final: normaliza el audio a -14 LUFS (dos pasadas + limitador) y exporta para redes.
// Uso: node exportar.mjs <render.mp4> [salida=entrega/final.mp4]
import { ff } from "./comun.mjs";

const [entrada, salida = "entrega/final.mp4"] = process.argv.slice(2);
if (!entrada) throw new Error("Uso: node exportar.mjs <render.mp4> [salida]");
const med = ff(["-i", entrada, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { quiet: false });
const m = JSON.parse(med.slice(med.lastIndexOf("{"), med.lastIndexOf("}") + 1));
const ln = `loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
await import("node:fs").then((fs) => fs.mkdirSync(salida.replace(/[\\/][^\\/]*$/, "") || ".", { recursive: true }));
ff(["-i", entrada, "-c:v", "libx264", "-b:v", "14M", "-maxrate", "16M", "-bufsize", "32M", "-pix_fmt", "yuv420p", "-r", "30",
  "-af", `${ln},alimiter=limit=0.84`, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", salida]);
console.log(`${salida} · audio medido ${m.input_i} LUFS → -14 LUFS`);
