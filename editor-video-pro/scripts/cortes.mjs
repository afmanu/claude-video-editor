// Paso 2: propone la lista de cortes (EDL) a partir de la transcripción.
// Quita silencios, muletillas y tomas repetidas (se queda la última). No decide sola: la EDL se enseña y se aprueba.
// Uso: node cortes.mjs [--silencio 0.35]
// Lee assets/transcript.json · escribe assets/piezas.json (lo que se queda) y EDL.md (para revisar).
import { leer, guardar, r3 } from "./comun.mjs";

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? parseFloat(process.argv[i + 1]) : d; };
const SIL = arg("--silencio", 0.35);
const PAD_IN = 0.08, PAD_OUT = 0.1; // margen antes y después de la voz: más margen al final deja ver la mirada apartándose
// Palabras con las que mucha gente marca una toma fallida al grabar ("otra", "repito"…). Solo cuentan al FINAL de un tramo
// (justo antes de una pausa), para no confundirlas con un uso normal ("otra herramienta"). Se cambian con --marcas a,b,c
const MARCAS = new Set((process.argv.includes("--marcas") ? process.argv[process.argv.indexOf("--marcas") + 1] : "otra,otra vez,repito").split(",").map((s) => s.trim()));
const MULETILLAS = new Set(["eh", "ehh", "em", "emm", "ehm", "mm", "mmm", "hmm", "ah", "uh", "um"]);
const RELLENO = new Set(["bueno", "vale", "pues", "entonces", "vale vale", "o sea", "nada", "digamos"]);
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zñ0-9 ]/g, "").trim();

const words = leer("assets/transcript.json");
// 1. Tramos de voz: se parte en cada silencio de más de SIL segundos; las muletillas sueltas desaparecen
const tramos = [];
let cur = null;
words.forEach((w) => {
  if (MULETILLAS.has(norm(w.text))) return;
  if (cur && w.start - cur.fin <= SIL) { cur.fin = w.end; cur.pal.push(w.text); cur.tiempos.push([w.start, w.end]); return; }
  if (cur) tramos.push(cur);
  cur = { ini: w.start, fin: w.end, pal: [w.text], tiempos: [[w.start, w.end]] };
});
if (cur) tramos.push(cur);

const toks = (t) => t.pal.map(norm).filter(Boolean);

// 1b. Dentro de cada tramo: si acaba en una marca de toma fallida, se quita entero; si una secuencia de 3+ palabras
//     se repite (falso arranque: "cómo lo hago, cómo lo hago paso a paso"), se quita el primer intento y se parte ahí.
const recortes = [];
const sub = (t, i, j) => ({ ini: t.tiempos[i][0], fin: t.tiempos[j - 1][1], pal: t.pal.slice(i, j), tiempos: t.tiempos.slice(i, j) });
const partir = (t) => {
  const w = t.pal.map(norm);
  if (MARCAS.has(w[w.length - 1]) || MARCAS.has(w.slice(-2).join(" "))) return [{ ...t, decision: "quitar: marca de toma fallida" }];
  for (let n = 4; n >= 3; n--)
    for (let k = 0; k + n <= w.length; k++)
      for (let j = k + 1; j + n <= w.length; j++)
        if (w.slice(k, k + n).join(" ") === w.slice(j, j + n).join(" ")) {
          recortes.push(`"${t.pal.slice(k, j).join(" ")}" (arranque repetido)`);
          return [...(k > 0 ? [sub(t, 0, k)] : []), ...partir(sub(t, j, t.pal.length))];
        }
  return [t];
};
tramos.splice(0, tramos.length, ...tramos.flatMap(partir));

// 2. Tomas repetidas: un tramo que empieza igual que uno de los dos siguientes o comparte casi todo su vocabulario
const repetido = (a, b) => {
  const A = toks(a), B = toks(b);
  if (A.length < 2) return false;
  const n = Math.min(3, A.length);
  if (A.slice(0, n).join(" ") === B.slice(0, n).join(" ")) return true;
  const SB = new Set(B);
  return A.filter((t) => SB.has(t)).length / A.length >= 0.75;
};
tramos.forEach((t, k) => {
  if (t.decision) return;
  if (RELLENO.has(toks(t).join(" "))) t.decision = "quitar: relleno";
  else for (let j = k + 1; j <= Math.min(k + 2, tramos.length - 1); j++) if (repetido(t, tramos[j])) { t.decision = `quitar: toma repetida (se queda la ${j + 1})`; break; }
  t.decision ||= "mantener";
});

// 3. Piezas con margen: el corte cae como mucho a mitad del silencio con la pieza vecina
const vivos = tramos.filter((t) => t.decision === "mantener");
const fin = words.length ? words[words.length - 1].end + 1 : 0;
const piezas = vivos.map((p, k) => {
  const ant = tramos[tramos.indexOf(p) - 1], sig = tramos[tramos.indexOf(p) + 1];
  const a = Math.max(0, p.ini - PAD_IN, ant ? (ant.fin + p.ini) / 2 : 0);
  const b = Math.min(p.fin + PAD_OUT, sig ? (p.fin + sig.ini) / 2 : fin);
  return { id: k + 1, a: r3(a), b: r3(b), texto: p.pal.join(" ") };
});
guardar("assets/piezas.json", piezas);

const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(2).padStart(5, "0")}`;
const total = piezas.reduce((s, p) => s + p.b - p.a, 0);
let md = `# Lista de cortes (propuesta)\n\nBruto: ${mmss(fin - 1)} · Montado: ${mmss(total)} · ${piezas.length} piezas\n\n`;
md += `Revisa sobre todo las tomas repetidas y lo marcado como relleno. Antes de darla por buena, mira la hoja de fotogramas de las uniones (node hoja.mjs) para comprobar que en cada corte se mira a cámara.\n\n`;
md += `| # | Desde | Hasta | Texto | Decisión |\n|---|---|---|---|---|\n`;
if (recortes.length) md += `**Recortado dentro de tramos:** ${recortes.join(" · ")}\n\n`;
tramos.forEach((t, k) => { md += `| ${k + 1} | ${mmss(t.ini)} | ${mmss(t.fin)} | ${t.pal.join(" ").replace(/\|/g, "/")} | ${t.decision} |\n`; });
guardar("EDL.md", md);
console.log(`${tramos.length} tramos · ${tramos.length - vivos.length} quitados · ${piezas.length} piezas · ${total.toFixed(1)} s montados → EDL.md y assets/piezas.json`);
