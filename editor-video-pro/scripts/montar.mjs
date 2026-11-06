// Monta un reel 9:16 a partir de beats.json + identidad.json → index.html (HyperFrames + GSAP).
// beats.json lo escribe Claude tras leer la transcripción (qué se explica en cada momento → qué componente).
// identidad.json lo genera el paso 0 de la skill (colores, fuentes, fondo, subtítulo, movimiento).
// Este script no decide nada de estilo: traduce la ficha aplicando siempre las mismas reglas.
// Uso: node montar.mjs [carpeta-del-proyecto]
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const DIR = process.argv[2] || ".";
const P = (p) => join(DIR, p);
const leer = (p) => JSON.parse(readFileSync(P(p), "utf8"));
if (!existsSync(P("identidad.json"))) throw new Error("Falta identidad.json: haz antes el paso 0 de la skill (references/identidad.md).");
const ID = leer("identidad.json");
const R = leer("beats.json");
const DUR = R.duracion;
const W = 1080, H = 1920;
const r3 = (n) => Math.round(n * 1000) / 1000;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ───────── identidad ───────── */
const C = ID.colores;
const lum = (hex) => {
  const n = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const sobre = (hex) => (lum(hex) > 0.4 ? "#0B0B0C" : "#FFFFFF"); // texto legible encima de un color
const CLARO = ID.tema === "claro";
const F = ID.fuentes;
const SUB = { estilo: "pildora", mayusculas: false, palabras: 3, tamano: 68, altura: 0.64, ...(ID.subtitulo || {}) };
const FONDO = { tipo: "liso", grano: false, vineta: true, ...(ID.fondo || {}) };
const TARJ = { estilo: "cristal", radio: 20, ...(ID.tarjeta || {}) };

// Personalidad del movimiento: entrada, salida y recorrido
const MOV = {
  suave: { d: 0.6, ease: "power3.out", dy: 40, s0: 0.97 },
  preciso: { d: 0.32, ease: "expo.out", dy: 24, s0: 1 },
  energico: { d: 0.42, ease: "back.out(1.6)", dy: 70, s0: 0.86 },
}[ID.movimiento] || { d: 0.45, ease: "power3.out", dy: 36, s0: 0.97 };

/* ───────── geometría por modo ───────── */
// cara: la persona a pantalla completa · dividida: gráficos arriba, persona abajo · grafico: solo gráfico, voz en off
const MODOS = {
  cara: { panel: "inset(0px 0px 1920px 0px)", vy: 0, cy: 520, esc: 0.86, capY: Math.round(SUB.altura * H) },
  dividida: { panel: "inset(0px 0px 960px 0px)", vy: 560, cy: 530, esc: 1, capY: 885 },
  grafico: { panel: "inset(0px 0px 0px 0px)", vy: 560, cy: 820, esc: 1.08, capY: 1450 },
};
const BEATS = R.beats.map((b, i) => ({ modo: "dividida", ...b, i, a: b.t, b: R.beats[i + 1] ? R.beats[i + 1].t : DUR }));
const modoEn = (t) => [...BEATS].reverse().find((b) => b.a <= t + 1e-6)?.modo || BEATS[0]?.modo || "cara";

/* ───────── utilidades de timeline ───────── */
const html = [], js = [], sfx = [];
const H_ = (s) => html.push(s), J = (s) => js.push(s);
const entra = (sel, t, extra = "") =>
  J(`tl.fromTo("${sel}", { opacity: 0, y: ${MOV.dy}, scale: ${MOV.s0}, filter: "blur(10px)" }, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: ${MOV.d}, ease: "${MOV.ease}", immediateRender: false${extra} }, ${r3(t)}); tl.set("${sel}", { opacity: 0 }, 0);`);
const sale = (sel, t) => J(`tl.to("${sel}", { opacity: 0, y: ${-Math.round(MOV.dy * 0.6)}, filter: "blur(12px)", duration: 0.25, ease: "power2.in" }, ${r3(t - 0.25)});`);
const suena = (nombre, t, vol) => sfx.push([nombre, Math.max(0, t), vol]);
// *palabra* → palabra en la fuente firma (o en el acento si no hay firma)
const marcar = (txt) => esc(txt).replace(/\*([^*]+)\*/g, '<span class="firma">$1</span>');
const fmt = (n, dec = 0) => {
  const [e, d] = Math.abs(n).toFixed(dec).split(".");
  return (n < 0 ? "-" : "") + e.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (d ? "," + d : "");
};

/* ───────── componentes ───────── */
const COMP = {
  // Frase protagonista, palabra a palabra
  titular(bt, id) {
    const pal = bt.texto.split(/\s+/);
    H_(`<div class="titular${bt.grande ? " grande" : ""}">${pal.map((p, k) => `<span class="tw" id="${id}w${k}">${marcar(p)}</span>`).join(" ")}</div>`);
    const tt = bt.tiempos || pal.map((_, k) => bt.a + 0.05 + k * 0.12);
    pal.forEach((_, k) => entra(`#${id}w${k}`, tt[k]));
    if (bt.grande) suena("impacto", bt.a, 0.18);
  },
  // Lista que se construye con la voz; el ítem activo manda y los anteriores se atenúan
  lista(bt, id) {
    const items = bt.items.map((it) => (typeof it === "string" ? { texto: it } : it));
    const tt = items.map((it, k) => it.t ?? bt.a + 0.3 + k * 0.6);
    H_(`${bt.titulo ? `<div class="sub">${marcar(bt.titulo)}</div>` : ""}<div class="tarjeta lista">${items
      .map((it, k) => {
        const m = it.estado === "bien" ? "✓" : it.estado === "mal" ? "✕" : "";
        return `<div class="fila" id="${id}i${k}"><span class="marca ${it.estado || ""}">${m}</span><span>${marcar(it.texto)}</span></div>`;
      })
      .join("")}</div>`);
    items.forEach((it, k) => {
      J(`tl.fromTo("#${id}i${k}", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: ${MOV.d * 0.8}, ease: "${MOV.ease}", immediateRender: false }, ${r3(tt[k])}); tl.set("#${id}i${k}", { opacity: 0 }, 0);`);
      if (k > 0) J(`tl.to("#${id}i${k - 1}", { opacity: 0.55, duration: 0.25, ease: "power2.out" }, ${r3(tt[k])});`);
      suena(it.estado === "bien" ? "campana" : "pop", tt[k] - 0.05, it.estado === "bien" ? 0.14 : 0.12);
    });
  },
  // Cifra que cuenta de un valor a otro
  cifra(bt, id) {
    const de = bt.de ?? 0, dec = bt.decimales ?? 0, t0 = bt.t_cuenta ?? bt.a + 0.2;
    H_(`<div class="cifra"><span>${esc(bt.prefijo || "")}</span><span id="${id}n">${fmt(de, dec)}</span><span>${esc(bt.sufijo || "")}</span></div>${bt.texto ? `<div class="sub centro">${marcar(bt.texto)}</div>` : ""}`);
    J(`(() => { const o = { v: ${de} }, el = document.querySelector("#${id}n");
      tl.to(o, { v: ${bt.hasta}, duration: ${bt.duracion_cuenta ?? 1}, ease: "power2.out", onUpdate: () => { el.textContent = fmt(o.v, ${dec}); } }, ${r3(t0)});
      tl.set(o, { v: ${de}, onComplete: () => { el.textContent = fmt(${de}, ${dec}); } }, 0); })();`);
    suena("impacto", t0, 0.16);
  },
  // Barra de prompt que se escribe y muta en el resultado (mismo elemento, dos estados)
  prompt(bt, id) {
    const pal = bt.texto.split(/\s+/);
    const t0 = bt.a + 0.35, tR = bt.t_resultado ?? r3(bt.a + (bt.b - bt.a) * 0.6);
    const paso = Math.min(0.14, (tR - t0 - 0.4) / pal.length);
    H_(`<div class="tarjeta prompt" id="${id}c"><div class="cab">${esc(bt.etiqueta_prompt || "Prompt")}</div><div class="pila">
      <div class="estado" id="${id}s1"><div class="barra">${pal.map((p, k) => `<span class="pw" id="${id}p${k}">${esc(p)}</span>`).join(" ")}<span class="cursor" id="${id}cur"></span></div></div>
      ${bt.resultado ? `<div class="estado res" id="${id}s2"><span class="marca bien">✓</span><span>${marcar(bt.resultado)}</span></div>` : ""}</div></div>`);
    pal.forEach((_, k) => J(`tl.set("#${id}p${k}", { opacity: 0 }, 0); tl.set("#${id}p${k}", { opacity: 1 }, ${r3(t0 + k * paso)});`));
    J(`tl.fromTo("#${id}cur", { opacity: 1 }, { opacity: 0, duration: 0.4, repeat: ${Math.max(1, Math.floor((tR - bt.a) / 0.8))}, yoyo: true, ease: "steps(1)" }, ${r3(bt.a)});`);
    suena("teclado", t0, 0.1);
    if (bt.resultado) {
      J(`tl.set("#${id}s2", { opacity: 0 }, 0);
      tl.to("#${id}s1", { opacity: 0, filter: "blur(10px)", duration: 0.15, ease: "power2.in" }, ${r3(tR - 0.15)});
      tl.fromTo("#${id}s2", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "power2.out", immediateRender: false }, ${r3(tR)});
      tl.to("#${id}c", { scale: 1.035, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, ${r3(tR)});`);
      suena("campana", tR, 0.14);
    }
  },
  // Antes (problema) → después (solución)
  comparar(bt, id) {
    const tD = bt.t_despues ?? r3(bt.a + (bt.b - bt.a) * 0.5);
    const lado = (k, d, cls, def) => `<div class="tarjeta lado ${cls}" id="${id}${k}"><div class="cab">${esc(d.titulo || def)}</div>${(d.items || []).map((x) => `<div class="fila"><span class="marca ${cls}">${cls === "bien" ? "✓" : "✕"}</span><span>${marcar(x)}</span></div>`).join("")}</div>`;
    H_(`<div class="comparar">${lado("A", bt.antes, "mal", "Antes")}${lado("B", bt.despues, "bien", "Después")}</div>`);
    J(`tl.fromTo("#${id}B", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: ${MOV.d}, ease: "${MOV.ease}", immediateRender: false }, ${r3(tD)}); tl.set("#${id}B", { opacity: 0 }, 0);
      tl.to("#${id}A", { opacity: 0.5, scale: 0.96, duration: 0.3, ease: "power2.out" }, ${r3(tD)});`);
    suena("campana", tD, 0.14);
  },
  // Proceso en pasos verticales: nodo → flecha → nodo
  flujo(bt, id) {
    const pasos = bt.pasos.map((p) => (typeof p === "string" ? { texto: p } : p));
    const tt = pasos.map((p, k) => p.t ?? bt.a + 0.25 + k * 0.7);
    H_(`<div class="flujo">${pasos
      .map((p, k) => `${k ? `<div class="flecha" id="${id}f${k}"></div>` : ""}<div class="tarjeta nodo${k === pasos.length - 1 && bt.resultado !== false ? " final" : ""}" id="${id}n${k}">${marcar(p.texto)}</div>`)
      .join("")}</div>`);
    pasos.forEach((_, k) => {
      if (k) J(`tl.fromTo("#${id}f${k}", { scaleY: 0 }, { scaleY: 1, duration: 0.25, ease: "power2.out", immediateRender: false }, ${r3(tt[k] - 0.2)}); tl.set("#${id}f${k}", { scaleY: 0 }, 0);`);
      J(`tl.fromTo("#${id}n${k}", { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: ${MOV.d * 0.8}, ease: "${MOV.ease}", immediateRender: false }, ${r3(tt[k])}); tl.set("#${id}n${k}", { opacity: 0 }, 0);`);
      suena(k === pasos.length - 1 ? "campana" : "pop", tt[k], 0.12);
    });
  },
  // Grabación de pantalla o imagen dentro de una tarjeta, con entrada en 3D y zoom opcional
  pantalla(bt, id) {
    const media = /\.(png|jpe?g|webp|svg)$/i.test(bt.src)
      ? `<img id="${id}m" src="${esc(bt.src)}" />`
      : `<video id="${id}m" src="${esc(bt.src)}" data-start="${r3(bt.a)}" data-duration="${r3(bt.b - bt.a)}" data-media-start="${bt.media_inicio || 0}" data-track-index="${3 + (bt.i % 4)}" muted playsinline></video>`;
    H_(`<div class="tarjeta pantalla" id="${id}c"><div class="marco">${media}</div></div>`);
    J(`tl.fromTo("#${id}c", { rotateX: 14 }, { rotateX: 0, duration: 0.7, ease: "power3.out", immediateRender: false }, ${r3(bt.a)});`);
    if (bt.zoom) {
      const z = bt.zoom;
      J(`tl.to("#${id}m", { scale: ${z.escala || 1.6}, transformOrigin: "${(z.x ?? 0.5) * 100}% ${(z.y ?? 0.5) * 100}%", duration: 0.6, ease: "power3.inOut" }, ${r3(z.t)});`);
    }
  },
  ninguno() {},
};

/* ───────── beats ───────── */
BEATS.forEach((bt) => {
  const id = "b" + bt.i, M = MODOS[bt.modo] || MODOS.dividida;
  if (!COMP[bt.tipo || "ninguno"]) throw new Error(`Componente desconocido en el beat ${bt.i}: ${bt.tipo}`);
  if (!bt.tipo || bt.tipo === "ninguno") return;
  H_(`<div class="slot" style="top:${M.cy}px"><div class="cam" id="${id}cam" style="transform:scale(${M.esc})"><div class="in" id="${id}">`);
  if (bt.etiqueta) H_(`<div class="etq" id="${id}e">${marcar(bt.etiqueta)}</div>`);
  COMP[bt.tipo](bt, id);
  H_(`</div></div></div>`);
  entra(`#${id}`, bt.a);
  if (bt.etiqueta) entra(`#${id}e`, bt.a + 0.05);
  J(`tl.fromTo("#${id}cam", { scale: ${M.esc} }, { scale: ${r3(M.esc * 1.035)}, duration: ${r3(bt.b - bt.a)}, ease: "none", immediateRender: false }, ${r3(bt.a)});`);
  if (bt.b < DUR - 0.05) sale(`#${id}`, bt.b);
  if (bt.i > 0) suena("whoosh", bt.a - 0.2, 0.2);
});

// Cambios de modo: el panel de gráficos y el vídeo se mueven a la vez
BEATS.forEach((bt, k) => {
  const M = MODOS[bt.modo] || MODOS.dividida;
  if (k === 0) return J(`tl.set("#panel", { clipPath: "${M.panel}" }, 0); tl.set("#vid", { y: ${M.vy} }, 0);`);
  if (BEATS[k - 1].modo === bt.modo) return;
  J(`tl.to("#panel", { clipPath: "${M.panel}", duration: 0.5, ease: "power3.inOut" }, ${r3(bt.a - 0.25)});
    tl.to("#vid", { y: ${M.vy}, duration: 0.5, ease: "power3.inOut" }, ${r3(bt.a - 0.25)});`);
});

// Punch-in alterno en cada corte del A-roll (cortes.json lo escribe aroll.mjs)
if (existsSync(P("assets/cortes.json"))) {
  leer("assets/cortes.json").forEach((t, k) => J(`tl.set("#vidin", { scale: ${k % 2 ? 1 : 1.12} }, ${r3(t)});`));
}

/* ───────── subtítulos ───────── */
const NO_FINAL = new Set("el la los las un una unos unas de del a al en que y o tu tus mi mis su sus con para por se te lo le me no es muy más".split(" "));
const ENF = new Set((R.enfasis || []).map((w) => w.toLowerCase()));
const words = (R.subtitulos || []).map(([texto, a, b]) => ({ texto, a, b }));
const bloques = [];
let cur = [];
words.forEach((w, k) => {
  cur.push(w);
  const nx = words[k + 1];
  const hueco = nx ? nx.a - w.b : 9;
  const limpio = w.texto.toLowerCase().replace(/[.,:;¿?¡!]/g, "");
  const punto = /[.,:;?!]$/.test(w.texto);
  const corta = !nx || hueco > 0.6 || cur.length >= SUB.palabras || (punto && cur.length >= 2);
  if (corta && !(NO_FINAL.has(limpio) && nx && hueco < 0.5 && cur.length < 4)) {
    bloques.push(cur);
    cur = [];
  }
});
if (cur.length) bloques.push(cur);

const caps = [];
const ON = {
  pildora: [`{ backgroundColor: "${C.acento}", color: "${sobre(C.acento)}" }`, `{ backgroundColor: "rgba(0,0,0,0)", color: "${C.texto}" }`],
  color: [`{ color: "${C.acento}" }`, `{ color: "${C.texto}" }`],
  caja: [`{ color: "${C.acento}" }`, `{ color: "${C.texto}" }`],
  subrayado: [`{ backgroundSize: "100% 0.12em" }`, `{ backgroundSize: "0% 0.12em" }`],
  resaltador: [`{ backgroundSize: "100% 0.5em" }`, `{ backgroundSize: "0% 0.5em" }`],
}[SUB.estilo] || [`{ color: "${C.acento}" }`, `{ color: "${C.texto}" }`];
bloques.forEach((bl, i) => {
  const a = Math.max(0, bl[0].a - 0.06);
  const fin = Math.min(bloques[i + 1] ? bloques[i + 1][0].a - 0.06 : DUR, bl[bl.length - 1].b + 0.6);
  const y = (MODOS[modoEn((a + fin) / 2)] || MODOS.cara).capY; // posición según el modo dominante del bloque
  caps.push(`<div class="cap" id="k${i}" style="top:${y}px">${bl.map((w, j) => `<span class="w${ENF.has(w.texto.toLowerCase().replace(/[.,:;¿?¡!]/g, "")) ? " enf" : ""}" id="k${i}w${j}">${esc(w.texto)}</span>`).join(" ")}</div>`);
  J(`tl.set("#k${i}", { opacity: 0 }, 0); tl.fromTo("#k${i}", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out", immediateRender: false }, ${r3(a)}); tl.set("#k${i}", { opacity: 0 }, ${r3(fin)});`);
  bl.forEach((w, j) => {
    if (ENF.has(w.texto.toLowerCase().replace(/[.,:;¿?¡!]/g, ""))) return;
    const off = j + 1 < bl.length ? bl[j + 1].a : fin;
    J(`tl.set("#k${i}w${j}", ${ON[0]}, ${r3(w.a)}); tl.set("#k${i}w${j}", ${ON[1]}, ${r3(off)});`);
  });
});

/* ───────── sonido ───────── */
// Efectos opcionales: si existe assets/sfx/<nombre>.mp3 se usa; si no, se omite.
const durAudio = (f) => {
  try {
    return parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
  } catch {
    return 1;
  }
};
if (R.sfx !== false) suena("impacto", 0, 0.16);
const audios = R.sfx === false ? [] : sfx
  .filter(([n]) => existsSync(P(`assets/sfx/${n}.mp3`)))
  .sort((x, y) => x[1] - y[1])
  .filter((s, k, arr) => !arr.slice(0, k).some((o) => o[0] === s[0] && Math.abs(o[1] - s[1]) < 0.15))
  .map(([n, t, v], k) => {
    const d = Math.min(durAudio(P(`assets/sfx/${n}.mp3`)), DUR - t);
    return `<audio id="sfx${k}" src="assets/sfx/${n}.mp3" data-start="${r3(t)}" data-duration="${r3(d)}" data-volume="${v}" data-track-index="${10 + (k % 4)}"></audio>`;
  });
const faltan = [...new Set(sfx.map((s) => s[0]))].filter((n) => !existsSync(P(`assets/sfx/${n}.mp3`)));

/* ───────── GSAP en local ───────── */
if (!existsSync(P("assets/gsap.min.js"))) {
  try {
    const req = createRequire(join(process.cwd(), "x.js"));
    const src = join(dirname(req.resolve("gsap/package.json")), "dist/gsap.min.js");
    mkdirSync(P("assets"), { recursive: true });
    copyFileSync(src, P("assets/gsap.min.js"));
  } catch {}
}
const GSAP = existsSync(P("assets/gsap.min.js")) ? "assets/gsap.min.js" : "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js";

/* ───────── CSS ───────── */
const fontFace = Object.values(F).filter((f) => f && f.archivo)
  .map((f) => `@font-face { font-family: "${f.familia}"; font-weight: ${f.peso || 400}; font-style: ${f.estilo || "normal"}; src: url("${f.archivo}") format("woff2"); }`).join("\n      ");
const fam = (f, def) => (f ? `"${f.familia}", ${def}` : def);
const PATRON = {
  liso: `background: ${C.fondo};`,
  degradado: `background: radial-gradient(ellipse 120% 70% at 50% 25%, ${C.fondo2} 0%, ${C.fondo} 70%);`,
  reticula: `background-color: ${C.fondo}; background-image: repeating-linear-gradient(0deg, color-mix(in srgb, ${C.texto} 6%, transparent) 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, color-mix(in srgb, ${C.texto} 6%, transparent) 0 1px, transparent 1px 80px);`,
  puntos: `background-color: ${C.fondo}; background-image: radial-gradient(color-mix(in srgb, ${C.texto} 16%, transparent) 2px, transparent 2.5px); background-size: 44px 44px;`,
  lineas: `background-color: ${C.fondo}; background-image: repeating-linear-gradient(0deg, color-mix(in srgb, ${C.texto} 7%, transparent) 0 1px, transparent 1px 64px);`,
}[FONDO.tipo] || `background: ${C.fondo};`;
const TARJETA = {
  cristal: `background: linear-gradient(135deg, color-mix(in srgb, ${C.texto} 9%, transparent), color-mix(in srgb, ${C.texto} 3%, transparent)); border: 1px solid color-mix(in srgb, ${C.texto} 14%, transparent); box-shadow: inset 0 1px 0 color-mix(in srgb, ${C.texto} 20%, transparent), 0 30px 60px rgba(0,0,0,${CLARO ? 0.12 : 0.45}); backdrop-filter: blur(14px);`,
  solida: `background: ${C.fondo2}; box-shadow: 0 24px 50px rgba(0,0,0,${CLARO ? 0.1 : 0.4});`,
  borde: `background: color-mix(in srgb, ${C.fondo2} 70%, transparent); border: 2px solid color-mix(in srgb, ${C.secundario} 45%, transparent);`,
  papel: `background: ${C.fondo2}; border: 3px solid ${C.texto}; box-shadow: 10px 10px 0 ${C.texto};`,
}[TARJ.estilo];
const CAP_ACTIVA = {
  pildora: `.w { padding: 2px 14px 8px; margin: 0 -0.04em; border-radius: ${Math.max(8, TARJ.radio)}px; }`,
  subrayado: `.w { background-image: linear-gradient(${C.acento}, ${C.acento}); background-repeat: no-repeat; background-position: 0 96%; background-size: 0% 0.12em; }`,
  resaltador: `.w { background-image: linear-gradient(color-mix(in srgb, ${C.acento} 75%, transparent), color-mix(in srgb, ${C.acento} 75%, transparent)); background-repeat: no-repeat; background-position: 0 85%; background-size: 0% 0.5em; }`,
  caja: `.cap { background: color-mix(in srgb, ${C.fondo} 88%, transparent); border: 2px solid color-mix(in srgb, ${C.acento} 60%, transparent); border-radius: ${TARJ.radio}px; padding: 10px 26px 16px; width: auto; max-width: 900px; left: 540px; transform: translateX(-50%); }`,
}[SUB.estilo] || "";

const page = `<!doctype html>
<html lang="es" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="${GSAP}"></script>
    <style>
      ${fontFace}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: ${C.fondo}; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; background: ${C.fondo}; color: ${C.texto}; font-family: ${fam(F.ui, "system-ui, sans-serif")}; }
      .capa { position: absolute; inset: 0; }
      #vid { position: absolute; inset: 0; }
      #vidin { position: absolute; inset: 0; transform-origin: 50% 35%; }
      #vidin video { width: 100%; height: 100%; object-fit: cover; display: block; }
      #panel { position: absolute; inset: 0; overflow: hidden; }
      #patron { position: absolute; left: -100px; top: -100px; width: ${W + 200}px; height: ${H + 200}px; ${PATRON} }
      #vineta { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 40%, ${C.fondo} 100%); opacity: ${FONDO.vineta ? 0.8 : 0}; }
      #grano { position: absolute; inset: 0; opacity: ${FONDO.grano ? (CLARO ? 0.05 : 0.07) : 0}; mix-blend-mode: overlay; }
      .slot { position: absolute; left: 110px; width: 860px; transform: translateY(-50%); perspective: 1400px; }
      .cam { transform-origin: 50% 50%; }
      .in { display: flex; flex-direction: column; gap: 22px; }
      .tarjeta { ${TARJETA} border-radius: ${TARJ.radio}px; padding: 28px 34px; }
      .etq { align-self: flex-start; font: 600 36px/1 ${fam(F.ui, "sans-serif")}; color: ${C.acento}; background: color-mix(in srgb, ${C.acento} 16%, transparent); padding: 10px 22px; border-radius: 999px; }
      .firma { ${F.firma ? `font-family: "${F.firma.familia}"; font-style: ${F.firma.estilo || "normal"}; font-weight: ${F.firma.peso || 400};` : ""} color: ${C.acento}; }
      .titular { font: ${F.titular?.peso || 800} 84px/1.08 ${fam(F.titular, "sans-serif")}; letter-spacing: -0.01em; text-align: center; }
      .titular.grande { font-size: 132px; }
      .tw { display: inline-block; }
      .sub { font: 500 42px/1.2 ${fam(F.ui, "sans-serif")}; color: ${C.secundario}; }
      .sub.centro { text-align: center; }
      .lista { display: flex; flex-direction: column; gap: 6px; padding: 18px 30px; }
      .fila { display: flex; align-items: center; gap: 22px; font: 600 46px/1.2 ${fam(F.ui, "sans-serif")}; padding: 14px 0; }
      .marca { flex: none; width: 44px; height: 44px; border-radius: 50%; display: grid; place-items: center; font: 700 28px/1 ${fam(F.ui, "sans-serif")}; background: color-mix(in srgb, ${C.acento} 22%, transparent); color: ${C.acento}; }
      .marca.bien { background: ${C.bien}; color: ${sobre(C.bien)}; }
      .marca.mal { background: ${C.mal}; color: ${sobre(C.mal)}; }
      .cifra { text-align: center; font: ${F.titular?.peso || 800} 210px/1 ${fam(F.titular, "sans-serif")}; color: ${C.enfasis}; letter-spacing: -0.03em; }
      .cab { font: 500 34px/1 ${fam(F.mono, "monospace")}; color: ${C.secundario}; margin-bottom: 16px; }
      .pila { display: grid; }
      .estado { grid-area: 1 / 1; }
      .barra { font: 500 44px/1.3 ${fam(F.mono || F.ui, "monospace")}; padding: 20px 24px; border-radius: ${Math.max(8, TARJ.radio - 6)}px; background: color-mix(in srgb, ${C.texto} 6%, transparent); border: 1px solid color-mix(in srgb, ${C.texto} 14%, transparent); }
      .cursor { display: inline-block; width: 4px; height: 1em; vertical-align: -0.15em; margin-left: 6px; background: ${C.acento}; }
      .res { display: flex; align-items: center; gap: 22px; font: 600 46px/1.2 ${fam(F.ui, "sans-serif")}; padding: 20px 24px; border-radius: ${Math.max(8, TARJ.radio - 6)}px; border: 2px solid ${C.bien}; }
      .comparar { display: flex; flex-direction: column; gap: 22px; }
      .lado .cab { font: 700 40px/1 ${fam(F.titular, "sans-serif")}; }
      .lado.mal .cab { color: ${C.mal}; }
      .lado.bien .cab { color: ${C.bien}; }
      .lado .fila { font-size: 44px; padding: 8px 0; }
      .flujo { display: flex; flex-direction: column; align-items: center; }
      .nodo { width: 640px; text-align: center; font: 600 46px/1.2 ${fam(F.ui, "sans-serif")}; padding: 26px 30px; }
      .nodo.final { border-color: ${C.bien}; box-shadow: 0 0 0 2px ${C.bien}; }
      .flecha { width: 4px; height: 56px; background: ${C.acento}; transform-origin: 50% 0; border-radius: 2px; }
      .pantalla { padding: 14px; }
      .marco { overflow: hidden; border-radius: ${Math.max(6, TARJ.radio - 8)}px; aspect-ratio: 16 / 10; }
      .marco img, .marco video { width: 100%; height: 100%; object-fit: cover; display: block; }
      .cap { position: absolute; left: 110px; width: 860px; transform: translateY(-50%); text-align: center; font: ${F.titular?.peso || 800} ${SUB.tamano}px/1.15 ${fam(F.titular, "sans-serif")}; color: ${C.texto}; text-transform: ${SUB.mayusculas ? "uppercase" : "none"}; text-shadow: 0 2px 0 rgba(0,0,0,${CLARO ? 0.15 : 0.5}), 0 0 18px rgba(0,0,0,${CLARO ? 0.2 : 0.6}); }
      .w { display: inline-block; margin: 0 0.04em; }
      .w.enf { color: ${C.enfasis}; }
      ${CAP_ACTIVA}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${DUR}" data-width="${W}" data-height="${H}">
      <div id="vid"><div id="vidin">
        <video id="aroll" src="${esc(R.aroll.src)}" data-start="0" data-duration="${DUR}" data-media-start="${R.aroll.inicio || 0}" data-track-index="0" playsinline data-has-audio="${R.aroll.audio === false ? "false" : "true"}"${R.aroll.audio === false ? " muted" : ""}></video>
      </div></div>
      <div id="panel">
        <div id="patron"></div><div id="vineta"></div>
        <svg id="grano" width="${W}" height="${H}"><filter id="ruido"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /></filter><rect width="100%" height="100%" filter="url(#ruido)" /></svg>
      </div>
      <div class="capa" id="graficos">
        ${html.join("\n        ")}
      </div>
      <div class="capa" id="subs">
        ${caps.join("\n        ")}
      </div>
      ${audios.join("\n      ")}
    </div>
    <script>
      const fmt = ${fmt.toString()};
      const tl = gsap.timeline({ paused: true });
      tl.fromTo("#patron", { y: 0 }, { y: -60, duration: ${DUR}, ease: "none" }, 0);
      ${js.join("\n      ")}
      tl.to({}, { duration: ${DUR} }, 0);
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
writeFileSync(P("index.html"), page);
console.log(`index.html · ${BEATS.length} beats (${BEATS.map((b) => `${b.tipo || "ninguno"}/${b.modo}@${b.a}`).join(" · ")}) · ${bloques.length} subtítulos · ${audios.length} efectos · ${DUR} s`);
if (faltan.length) console.log(`Efectos sin archivo (se omiten): ${faltan.map((n) => `assets/sfx/${n}.mp3`).join(", ")}`);
if (GSAP.startsWith("http")) console.log("Aviso: GSAP se carga desde internet. Para render sin red: npm i gsap y vuelve a montar.");
