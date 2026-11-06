// Paso 1: comprueba el bruto, convierte el HDR del iPhone si hace falta, extrae el audio y transcribe.
// Uso: node preparar.mjs <bruto.mp4|.mov> [idioma=es]   (se ejecuta en la carpeta del proyecto)
// Deja en assets/: bruto.json (ruta e info), audio16k.wav y transcript.json (palabras con tiempos).
import { resolve } from "node:path";
import { existsSync } from "node:fs";
import { ff, probe, transcribir, guardar } from "./comun.mjs";

const [bruto, idioma = "es"] = process.argv.slice(2);
if (!bruto || !existsSync(bruto)) throw new Error("Uso: node preparar.mjs <bruto> [idioma]");
const info = probe(bruto);
console.log(`Bruto: ${info.w}×${info.h} · ${info.fps.toFixed(2)} fps · ${info.dur.toFixed(1)} s · ${info.audios} pista(s) de audio${info.hdr ? " · HDR" : ""}`);

let fuente = resolve(bruto);
if (info.hdr) {
  // Solo conversión de gama BT.2020 → BT.709, sin tonemap (el tonemap quema o apaga la piel)
  console.log("HDR detectado: convirtiendo la gama de color a BT.709 (puede tardar)…");
  fuente = resolve("assets/bruto-sdr.mp4");
  ff(["-i", bruto, "-map", "0:v:0", "-map", "0:a:0?", "-vf", "zscale=tin=bt709:pin=bt2020:min=bt2020nc:rin=tv:t=bt709:p=bt709:m=bt709:r=tv,format=yuv420p",
    "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-c:a", "aac", "-b:a", "256k", fuente]);
}
guardar("assets/bruto.json", { ruta: fuente, original: resolve(bruto), ...info });
ff(["-i", fuente, "-map", "0:a:0", "-ac", "1", "-ar", "16000", "assets/audio16k.wav"]);
console.log("Transcribiendo (la primera vez descarga el modelo)…");
const words = transcribir("assets/audio16k.wav", idioma);
guardar("assets/transcript.json", words);
console.log(`${words.length} palabras → assets/transcript.json`);
console.log("Texto:\n" + words.map((w) => w.text).join(" ").slice(0, 1500));
