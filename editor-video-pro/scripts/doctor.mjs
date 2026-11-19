// Comprueba que el ordenador tiene todo lo que necesita la skill y dice cómo arreglar lo que falte.
// Uso: node <skill>/scripts/doctor.mjs
// Cada línea sale como OK, FALTA o AVISO. Termina con código 1 si falta algo imprescindible.
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

const WIN = process.platform === "win32", MAC = process.platform === "darwin";
const res = [];
const sh = (cmd) => {
  const r = spawnSync(cmd, { shell: true, encoding: "utf8", timeout: 180000 });
  const out = ((r.stdout || "") + (r.stderr || "")).replace(/\x1b\[[0-9;]*m/g, "").trim().split(/\r?\n/)[0] || "";
  return { ok: r.status === 0, out: out.slice(0, 120) };
};
const anota = (estado, nombre, detalle, arreglo = "") => {
  res.push(estado);
  console.log(`${estado.padEnd(6)} ${nombre}: ${detalle}${arreglo && estado !== "OK" ? `\n       → ${arreglo}` : ""}`);
};

console.log("Comprobando el equipo para editor-video-pro…\n");

const node = Number(process.versions.node.split(".")[0]);
anota(node >= 20 ? "OK" : "FALTA", "Node.js", process.version, "Instala la versión LTS desde nodejs.org y abre una terminal nueva.");

for (const bin of ["ffmpeg", "ffprobe"]) {
  const r = sh(`${bin} -version`);
  anota(r.ok ? "OK" : "FALTA", bin, r.ok ? r.out.split(" Copyright")[0] : "no se encuentra",
    WIN ? "winget install Gyan.FFmpeg y después cierra y abre la terminal (a veces hace falta reiniciar)." : MAC ? "brew install ffmpeg" : "sudo apt install ffmpeg (o el gestor de paquetes de tu sistema).");
}
{
  const r2 = spawnSync("ffmpeg", ["-hide_banner", "-filters"], { encoding: "utf8", shell: WIN });
  const filtros = (r2.stdout || "") + (r2.stderr || "");
  if (r2.status === 0) anota(/zscale/.test(filtros) ? "OK" : "AVISO", "ffmpeg: filtro zscale", /zscale/.test(filtros) ? "disponible" : "no está",
    "Solo hace falta para vídeos HDR del iPhone. Instala una versión \"full\" de ffmpeg o graba en SDR (Ajustes > Cámara > Formatos).");
}

const hf = sh("npx -y hyperframes --version");
anota(hf.ok ? "OK" : "FALTA", "HyperFrames", hf.ok ? hf.out : "no responde", "Necesita internet la primera vez: prueba npx -y hyperframes --version y revisa el error.");

{
  const dir = join(homedir(), ".cache", "hyperframes", "parakeet");
  const hay = existsSync(dir) && readdirSync(dir).length > 0;
  anota(hay ? "OK" : "AVISO", "Modelo de transcripción (Parakeet)", hay ? "descargado" : "no lo encuentro",
    "npx hyperframes models install parakeet (una vez, unos 640 MB). Si no, se instala solo la primera vez que transcribas.");
}

if (hf.ok) {
  const r = sh("npx -y hyperframes browser ensure");
  anota(r.ok ? "OK" : "FALTA", "Navegador para el render", r.ok ? "listo" : r.out || "no disponible", "Instala Google Chrome o ejecuta npx hyperframes browser ensure.");
}

// Carpeta de trabajo (solo avisos: no son errores)
console.log("");
if (existsSync("identidad.json")) anota("OK", "Tu identidad", "identidad.json en esta carpeta");
else if (existsSync("mi-estilo/MI-ESTILO.md")) anota("AVISO", "Tu identidad", "aún no hay identidad.json, pero tienes MI-ESTILO.md", "Dile a Claude: \"Ya he rellenado mi estilo\".");
else anota("AVISO", "Tu identidad", "aún no la has creado", "node <skill>/scripts/empezar.mjs para preparar la carpeta, o pídele a Claude que empecéis por tu identidad.");
if (existsSync("mi-estilo/referencias")) {
  const n = readdirSync("mi-estilo/referencias").filter((f) => /\.(mp4|mov|m4v|webm|mkv)$/i.test(f)).length;
  anota(n >= 2 ? "OK" : "AVISO", "Referencias", `${n} vídeo(s) en mi-estilo/referencias`, "Opcional: 2 o 3 vídeos parecidos entre sí dan el mejor análisis.");
}

const falta = res.filter((e) => e === "FALTA").length, aviso = res.filter((e) => e === "AVISO").length;
console.log(`\n${falta ? `Falta ${falta} cosa(s) imprescindible(s).` : "Todo lo imprescindible está listo."}${aviso ? ` ${aviso} aviso(s).` : ""}`);
process.exit(falta ? 1 : 0);
