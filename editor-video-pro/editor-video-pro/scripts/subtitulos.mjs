// Paso 4: transcribe el A-roll ya montado (tiempos exactos de la línea de tiempo final),
// aplica correcciones y escribe los subtítulos en beats.json y en subtitulos.srt.
// Uso: node subtitulos.mjs [idioma=es]
// Correcciones opcionales en assets/correcciones.json: { "Cloud": "Claude", "jipiti": "GPT" }
import { existsSync } from "node:fs";
import { ff, leer, guardar, probe, transcribir, r3 } from "./comun.mjs";

const idioma = process.argv[2] || "es";
ff(["-i", "assets/aroll.mp4", "-map", "0:a:0", "-ac", "1", "-ar", "16000", "assets/aroll16k.wav"]);
const FIX = existsSync("assets/correcciones.json") ? leer("assets/correcciones.json") : {};
const words = transcribir("assets/aroll16k.wav", idioma).map((w) => ({ ...w, text: FIX[w.text] ?? w.text }));
const dur = r3(probe("assets/aroll.mp4").dur);

const beats = existsSync("beats.json") ? leer("beats.json") : { formato: "reel", duracion: dur, aroll: { src: "assets/aroll.mp4" }, enfasis: [], beats: [{ t: 0, modo: "cara", tipo: "ninguno" }] };
beats.duracion = dur;
beats.subtitulos = words.map((w) => [w.text, w.start, w.end]);
guardar("beats.json", JSON.stringify(beats, null, 2).replace(/\[\n\s+("[^"]*"),\n\s+([\d.]+),\n\s+([\d.]+)\n\s+\]/g, "[$1, $2, $3]"));

// SRT en bloques de 2-4 palabras (para YouTube o para montar en otro editor)
const ts = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`; };
const bloques = [];
words.forEach((w, k) => {
  const ult = bloques[bloques.length - 1];
  if (!ult || ult.length >= 4 || w.start - ult[ult.length - 1].end > 0.6 || (/[.,:;?!]$/.test(ult[ult.length - 1].text) && ult.length >= 2)) bloques.push([w]);
  else ult.push(w);
});
guardar("subtitulos.srt", bloques.map((b, k) => `${k + 1}\n${ts(b[0].start)} --> ${ts(b[b.length - 1].end + 0.1)}\n${b.map((w) => w.text).join(" ")}\n`).join("\n"));
console.log(`${words.length} palabras · ${bloques.length} bloques → beats.json (subtitulos) y subtitulos.srt`);
console.log(words.map((w) => w.text).join(" "));
