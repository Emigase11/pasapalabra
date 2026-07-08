/**
 * Convierte un JSON de diccionario con múltiples palabras por letra
 * al formato plano que usa el juego (una entrada por letra).
 *
 * Uso:
 *   npx tsx scripts/convertir-diccionario.ts <archivo.json> [id] [nombre]
 *
 * Ejemplos:
 *   npx tsx scripts/convertir-diccionario.ts general_media.json general-media "General"
 *   npx tsx scripts/convertir-diccionario.ts deportes.json deportes "Deportes"
 *
 * El archivo de salida se guarda en data/rosco-<id>.json.
 * Si no se pasa id, se infiere del nombre del archivo de entrada.
 */

import fs from "fs";
import path from "path";

// ── Tipos ──────────────────────────────────────────────────────────────────────

type TipoPista = "empieza" | "contiene";

interface EntradaFuente {
  palabra: string;
  definicion: string;
  tipo: TipoPista;
}

interface FormatoFuente {
  categoria?: string;
  dificultad?: string;
  palabras: Record<string, EntradaFuente[]>;
}

interface EntradaJuego {
  letra: string;
  palabra: string;
  definicion: string;
  tipo: TipoPista;
}

// ── Constantes ─────────────────────────────────────────────────────────────────

const LETRAS_ESPERADAS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Quita guiones bajos y normaliza espacios de una palabra. */
function limpiarPalabra(p: string): string {
  return p.replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Valida que la palabra realmente corresponda a la letra según el tipo.
 * Normaliza para comparar (minúsculas, sin tildes).
 */
function palabraCorrespondeALetra(
  palabra: string,
  letra: string,
  tipo: TipoPista,
): boolean {
  const norm = (s: string) =>
    s.toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .normalize("NFC")
      .replace(/ñ/g, "n");

  const p = norm(limpiarPalabra(palabra));
  const l = norm(letra);

  return tipo === "empieza" ? p.startsWith(l) : p.includes(l);
}

// ── Main ───────────────────────────────────────────────────────────────────────

const [, , archivoEntrada, idArg, nombreArg] = process.argv;

if (!archivoEntrada) {
  console.error("Uso: npx tsx scripts/convertir-diccionario.ts <archivo.json> [id] [nombre]");
  process.exit(1);
}

const rutaEntrada = path.resolve(archivoEntrada);
if (!fs.existsSync(rutaEntrada)) {
  console.error(`❌  No se encontró: ${rutaEntrada}`);
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(rutaEntrada, "utf-8")) as FormatoFuente;

// Inferir id y nombre si no se pasan.
const baseName = path.basename(archivoEntrada, ".json");
const id = idArg ?? baseName.replace(/^rosco-?/, "").replace(/_/g, "-");
const nombre = nombreArg ?? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ");

console.log(`\n📖  Convirtiendo: ${rutaEntrada}`);
console.log(`    id:     ${id}`);
console.log(`    nombre: ${nombre}\n`);

const advertencias: string[] = [];
const errores: string[] = [];
const resultado: EntradaJuego[] = [];

for (const letra of LETRAS_ESPERADAS) {
  const candidatos = raw.palabras?.[letra];

  if (!candidatos || candidatos.length === 0) {
    errores.push(`  ✗ Falta la letra ${letra}`);
    continue;
  }

  // Buscar el primer candidato válido (que corresponda a la letra según el tipo).
  let elegida: EntradaFuente | null = null;

  for (const c of candidatos) {
    const palabraLimpia = limpiarPalabra(c.palabra);
    if (palabraCorrespondeALetra(palabraLimpia, letra, c.tipo)) {
      elegida = c;
      break;
    } else {
      advertencias.push(
        `  ⚠  ${letra}: "${c.palabra}" no ${c.tipo === "empieza" ? "empieza" : "contiene"} la letra → saltada`,
      );
    }
  }

  if (!elegida) {
    errores.push(`  ✗ ${letra}: ningún candidato válido entre ${candidatos.length} opciones`);
    // Usar el primero de todas formas para no perder la letra.
    elegida = candidatos[0];
    advertencias.push(`  ⚠  ${letra}: usando "${elegida.palabra}" de todas formas (revisar manualmente)`);
  }

  const palabraFinal = limpiarPalabra(elegida.palabra);

  if (palabraFinal !== elegida.palabra) {
    advertencias.push(`  ℹ  ${letra}: guiones_bajos → espacios: "${elegida.palabra}" → "${palabraFinal}"`);
  }

  resultado.push({
    letra,
    palabra: palabraFinal,
    definicion: elegida.definicion,
    tipo: elegida.tipo,
  });
}

// ── Reporte ────────────────────────────────────────────────────────────────────

if (advertencias.length) {
  console.log("Advertencias:");
  advertencias.forEach((a) => console.log(a));
  console.log();
}

if (errores.length) {
  console.log("Errores:");
  errores.forEach((e) => console.error(e));
  console.log();
}

// ── Guardar ────────────────────────────────────────────────────────────────────

const letrasOk = resultado.length;
const letrasTotal = LETRAS_ESPERADAS.length;

if (letrasOk < letrasTotal) {
  console.warn(`⚠  Solo se pudieron mapear ${letrasOk}/${letrasTotal} letras.`);
}

const rutaSalida = path.resolve(`data/rosco-${id}.json`);
fs.writeFileSync(rutaSalida, JSON.stringify(resultado, null, 2) + "\n", "utf-8");

console.log(`✅  ${letrasOk}/${letrasTotal} letras procesadas.`);
console.log(`💾  Guardado en: ${rutaSalida}\n`);
console.log("Próximo paso — agregá esto en lib/diccionarios.ts:");
console.log(`  import rosco${id.replace(/-/g, "_")} from "@/data/rosco-${id}.json";`);
console.log(`  { id: "${id}", nombre: "${nombre}", entradas: rosco${id.replace(/-/g, "_")} as Entrada[] },`);
console.log();
