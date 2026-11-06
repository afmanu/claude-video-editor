// Utilidades compartidas por los scripts (ffmpeg, ffprobe, transcripción).
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

export const r3 = (n) => Math.round(n * 1000) / 1000;
export const leer = (p) => JSON.parse(readFileSync(p, "utf8"));
export const guardar = (p, d) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, typeof d === "string" ? d : JSON.stringify(d, null, 2)); };

export function ff(args, { quiet = true } = {}) {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-y", ...(quiet ? ["-loglevel", "error"] : []), ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.error) throw new Error("No encuentro ffmpeg. Instálalo y comprueba que está en el PATH (ver GUIA.md).");
  if (r.status !== 0) throw new Error("ffmpeg falló:\n" + r.stderr.slice(-2000));
  return r.stderr;
}

export function probe(f) {
  const j = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_streams", "-show_format", f]).toString());
  const v = j.streams.find((s) => s.codec_type === "video");
  const [n, d] = (v?.avg_frame_rate || "30/1").split("/").map(Number);
  return {
    dur: parseFloat(j.format.duration),
    w: v?.width, h: v?.height, fps: d ? n / d : 30,
    hdr: ["arib-std-b67", "smpte2084"].includes(v?.color_transfer),
    rot: Number(v?.side_data_list?.find((s) => s.rotation !== undefined)?.rotation || 0),
    audios: j.streams.filter((s) => s.codec_type === "audio").length,
  };
}

// Transcribe con HyperFrames (Parakeet o whisper) y devuelve [{text, start, end}]
export function transcribir(audio, idioma = "es") {
  const tmp = resolve(join(dirname(audio), ".transcripcion"));
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const r = spawnSync("npx", ["-y", "hyperframes", "transcribe", resolve(audio), "--language", idioma, "-d", tmp, "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "inherit"], shell: process.platform === "win32", maxBuffer: 1 << 28 });
  if (r.status !== 0) throw new Error("La transcripción falló. Prueba a mano: npx hyperframes transcribe " + audio + " --language " + idioma);
  const f = join(tmp, "transcript.json");
  const src = existsSync(f) ? leer(f) : JSON.parse(r.stdout);
  const words = Array.isArray(src) ? src : src.words || src.transcript?.words || [];
  return words.map((w) => ({ text: (w.text ?? w.word ?? "").trim(), start: r3(w.start), end: r3(w.end) })).filter((w) => w.text);
}
