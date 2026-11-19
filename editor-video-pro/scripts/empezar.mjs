// Prepara la carpeta de trabajo. No borra ni sobrescribe nada que ya exista.
// Uso (desde la carpeta donde quieras trabajar, por ejemplo Videos/estudio):
//   node <skill>/scripts/empezar.mjs              → crea mi-estilo/ con MI-ESTILO.md y referencias/
//   node <skill>/scripts/empezar.mjs <tema>       → además crea la carpeta de un vídeo: <tema>/ con brutos/, objetivo/, assets/, renders/, entrega/ y CAMBIOS.md
import { existsSync, mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = join(dirname(fileURLToPath(import.meta.url)), "..");
const hecho = [];
const carpeta = (p) => { if (!existsSync(p)) { mkdirSync(p, { recursive: true }); hecho.push(p + "/"); } };
const copia = (de, a) => { if (!existsSync(a) && existsSync(de)) { copyFileSync(de, a); hecho.push(a); } };
const escribe = (p, txt) => { if (!existsSync(p)) { writeFileSync(p, txt); hecho.push(p); } };

// Estilo (una vez)
carpeta("mi-estilo/referencias");
copia(join(SKILL, "MI-ESTILO.md"), "mi-estilo/MI-ESTILO.md");
escribe("mi-estilo/referencias/LEEME.txt",
  "Deja aquí 2 o 3 vídeos cuya edición te guste y que se parezcan entre sí (mp4, mov o webm).\n" +
  "Sirven para estudiar ritmo, subtítulos, gráficos y cierre. Nunca se usan en tus vídeos.\n" +
  "Si un vídeo no trae sonido, pon el audio al lado como <nombre>.audio.m4a.\n");

// Un vídeo
const tema = process.argv[2];
if (tema) {
  const slug = tema.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) throw new Error("El tema tiene que tener letras o números: node empezar.mjs mi-primer-reel");
  for (const sub of ["brutos", "objetivo", "assets", "renders", "entrega"]) carpeta(join(slug, sub));
  for (const f of ["identidad.json", "identidad.md"]) copia(f, join(slug, f));
  escribe(join(slug, "objetivo", "LEEME.txt"),
    "Opcional: deja aquí UN vídeo al que quieras que se parezca este (estructura, ritmo, gancho y cierre).\n" +
    "Claude lo estudia y lo traduce a tu estilo. Nunca entra en el montaje.\n");
  const hoy = new Date().toISOString().slice(0, 10);
  escribe(join(slug, "CAMBIOS.md"), `# Cambios · ${slug}\n\nUna línea por versión: qué se cambió y por qué.\n\n| Versión | Fecha | Cambio |\n|---|---|---|\n| — | ${hoy} | Carpeta creada |\n`);
  console.log(`\nVídeo: mete el bruto en ${slug}/brutos/ y, si quieres, un vídeo a imitar en ${slug}/objetivo/.`);
}

console.log(hecho.length ? "Creado:\n  " + hecho.join("\n  ") : "No había nada que crear: todo existía ya.");
if (!existsSync("identidad.json")) console.log("\nSiguiente: rellena mi-estilo/MI-ESTILO.md, deja tus referencias en mi-estilo/referencias/ y dile a Claude: \"Ya he rellenado mi estilo\".");
