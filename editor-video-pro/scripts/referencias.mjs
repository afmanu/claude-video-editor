// Parte mecánica del análisis de referencias y del vídeo objetivo (references/referencias.md).
// Mide y extrae; no decide nada de estilo: las reglas las escribe Claude mirando las hojas.
// Uso (desde la carpeta de trabajo):
//   node <skill>/scripts/referencias.mjs mi-estilo/referencias [--idioma es] [--umbral 0.1]
//   node <skill>/scripts/referencias.mjs mi-video/objetivo     [--idioma en]
// Por cada vídeo de la carpeta deja en <carpeta>/_datos/<nombre>/:
//   info.json, cortes.json, hoja-NN.jpg (un fotograma por plano), ritmo-NN.jpg (uno por segundo),
//   hook.jpg (0-3 s), final.jpg (últimos 6 s), transcript.json y resumen.json.
import { existsSync, readdirSync, rmSync, mkdirSync } from "node:fs";
import { join, parse } from "node:path";
import { spawnSync } from "node:child_process";
import { ff, probe, transcribir, guardar } from "./comun.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : d; };
const CARPETA = process.argv[2];
if (!CARPETA || !existsSync(CARPETA)) throw new Error("Uso: node referencias.mjs <carpeta con vídeos> [--idioma es] [--umbral 0.1]");
const IDIOMA = arg("--idioma", "es"), UMBRAL = Number(arg("--umbral", "0.1"));
const r1 = (n) => Math.round(n * 10) / 10;

// Rótulo con el segundo en cada fotograma. Si este ffmpeg no tiene drawtext o fuentes, se sigue sin rótulo
// (el segundo queda igualmente en el nombre del fotograma y en la tabla que imprime el script).
let ROTULO = true;
const rot = (texto, size) => `drawtext=text='${texto}':x=8:y=8:fontsize=${size}:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6`;
const conRotulo = (args) => {
  try { return ff(args(true)); } catch (e) { if (!ROTULO) throw e; ROTULO = false; console.log("   (ffmpeg sin drawtext: hojas sin rótulo de tiempo)"); return ff(args(false)); }
};
const foto = (src, t, out) => conRotulo((r) => ["-ss", String(Math.max(0, t)), "-i", src, "-frames:v", "1", "-vf", `scale=270:-2${r && ROTULO ? "," + rot(`${r1(t).toFixed(1)} s`, 26) : ""}`, out]);

const VIDEOS = readdirSync(CARPETA).filter((f) => /\.(mp4|mov|m4v|webm|mkv)$/i.test(f));
if (!VIDEOS.length) throw new Error(`No hay vídeos en ${CARPETA}/ (mp4, mov, m4v, webm o mkv)`);
const resumen = [];

for (const f of VIDEOS) {
  const src = join(CARPETA, f), base = parse(f).name;
  const D = join(CARPETA, "_datos", base), FR = join(D, "frames");
  rmSync(FR, { recursive: true, force: true });
  mkdirSync(FR, { recursive: true });
  console.log(`── ${f}`);

  const info = probe(src);
  guardar(join(D, "info.json"), info);
  const dur = info.dur;

  // Cortes por cambio de escena (sobre una copia pequeña para ir rápido)
  const log = spawnSync("ffmpeg", ["-hide_banner", "-i", src, "-an", "-vf", `scale=270:-2,select='gt(scene,${UMBRAL})',showinfo`, "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 }).stderr || "";
  const cortes = [...log.matchAll(/pts_time:([\d.]+)/g)].map((m) => r1(Number(m[1]))).filter((t, i, a) => t > 0.2 && (i === 0 || t - a[i - 1] >= 0.2));
  const planos = [0, ...cortes];
  guardar(join(D, "cortes.json"), { umbral: UMBRAL, cortes, cortesPorMinuto: r1(cortes.length / (dur / 60)), planoMedio: r1(dur / planos.length) });

  planos.forEach((t, k) => foto(src, t + 0.1, join(FR, `p${String(k + 1).padStart(3, "0")}.jpg`)));
  ff(["-i", join(FR, "p%03d.jpg"), "-vf", "tile=6x5", join(D, "hoja-%02d.jpg")]);

  conRotulo((r) => ["-i", src, "-vf", `fps=1,scale=180:-2${r && ROTULO ? "," + rot("%{eif\\:t\\:d} s", 20) : ""},tile=10x6`, join(D, "ritmo-%02d.jpg")]);

  const HK = join(D, "_hook"), FI = join(D, "_final");
  for (const [dir, ts] of [[HK, [0, 0.5, 1, 1.5, 2, 2.5, 3]], [FI, [6, 5, 4, 3, 2, 1].map((s) => Math.max(0, dur - s))]]) {
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir);
    ts.forEach((t, k) => foto(src, t, join(dir, `f${k}.jpg`)));
  }
  ff(["-i", join(HK, "f%d.jpg"), "-vf", "tile=7x1", "-frames:v", "1", join(D, "hook.jpg")]);
  ff(["-i", join(FI, "f%d.jpg"), "-vf", "tile=6x1", "-frames:v", "1", join(D, "final.jpg")]);
  rmSync(HK, { recursive: true }); rmSync(FI, { recursive: true });

  // Audio: el del vídeo o, si no trae, <nombre>.audio.m4a al lado
  let palabras = [], lufs = null;
  const aparte = join(CARPETA, `${base}.audio.m4a`);
  const asrc = info.audios ? src : existsSync(aparte) ? aparte : null;
  if (asrc) {
    const wav = join(D, "audio16k.wav");
    ff(["-i", asrc, "-map", "0:a:0", "-ac", "1", "-ar", "16000", wav]);
    try { palabras = transcribir(wav, IDIOMA); guardar(join(D, "transcript.json"), palabras); }
    catch (e) { console.log("   No se pudo transcribir: " + e.message.split("\n")[0]); }
    rmSync(wav, { force: true });
    rmSync(join(D, ".transcripcion"), { recursive: true, force: true });
    const m = (spawnSync("ffmpeg", ["-hide_banner", "-i", asrc, "-map", "0:a:0", "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 28 }).stderr || "").match(/I:\s+(-?[\d.]+) LUFS/g);
    lufs = m ? Number(m.at(-1).match(/-?[\d.]+/)[0]) : null;
  } else console.log("   Sin audio: se mide solo la imagen");

  const texto = (a, b) => palabras.filter((w) => w.start >= a && w.start < b).map((w) => w.text).join(" ");
  const r = {
    archivo: f, duracion: r1(dur), tamano: `${info.w}×${info.h}`, fps: r1(info.fps), hdr: info.hdr,
    planos: planos.length, cortesPorMinuto: r1(cortes.length / (dur / 60)), planoMedio: r1(dur / planos.length),
    palabrasPorMinuto: palabras.length ? Math.round(palabras.length / (dur / 60)) : null, lufs,
    gancho3s: texto(0, 3), cierre6s: texto(dur - 6, dur + 1),
    segundosDeLosPlanos: planos,
  };
  guardar(join(D, "resumen.json"), r);
  resumen.push(r);
  console.log(`   ${r.duracion} s · ${r.planos} planos · ${r.cortesPorMinuto} cortes/min · ${r.palabrasPorMinuto ?? "—"} palabras/min · ${lufs ?? "—"} LUFS`);
}
guardar(join(CARPETA, "_datos", "resumen.json"), resumen);
console.log(`Listo: ${join(CARPETA, "_datos")}. Siguiente: mirar las hojas, hook.jpg y final.jpg y escribir el análisis (references/referencias.md).`);
