import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.join(__dirname, "../data");

const FUENTES = [
  "general-facil",
  "deportes-facil",
  "deportes-media",
  "deportes-dificil",
  "futbol-facil",
  "futbol-media",
  "futbol-dificil",
  "historia-facil",
  "historia-media",
  "historia-dificil",
];

const ORDEN_LETRAS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z",
];

// Elimina prefijos tipo "Con la A. ", "Con la Ñ. ", "Contiene la X. ", etc.
function limpiarDefinicion(def: string): string {
  return def
    .replace(/^Con(?:tiene)? (?:la |el )?\w\.?\s*/i, "")
    .replace(/^Con la [A-ZÑ]\.\s*/i, "")
    .trim();
}

for (const nombre of FUENTES) {
  const rutaFuente = path.join(DATA_DIR, `${nombre}.json`);
  if (!fs.existsSync(rutaFuente)) {
    console.warn(`⚠️  No existe: ${nombre}.json`);
    continue;
  }

  const fuente = JSON.parse(fs.readFileSync(rutaFuente, "utf-8"));
  const palabras: Record<string, { palabra: string; definicion: string; tipo: string }[]> =
    fuente.palabras;

  const resultado: { letra: string; palabra: string; definicion: string; tipo: string }[] = [];

  const letrasPresentes = Object.keys(palabras);
  const letrasAusentes: string[] = [];

  for (const letra of ORDEN_LETRAS) {
    const candidatos = palabras[letra];
    if (!candidatos || candidatos.length === 0) {
      letrasAusentes.push(letra);
      continue;
    }
    for (const c of candidatos) {
      resultado.push({
        letra,
        palabra: c.palabra.replace(/_/g, " ").trim(),
        definicion: limpiarDefinicion(c.definicion),
        tipo: c.tipo,
      });
    }
  }

  const salidaNombre = `rosco-${nombre}.json`;
  const rutaSalida = path.join(DATA_DIR, salidaNombre);
  fs.writeFileSync(rutaSalida, JSON.stringify(resultado, null, 2), "utf-8");

  const totalEntradas = resultado.length;
  const totalLetras = ORDEN_LETRAS.length - letrasAusentes.length;
  console.log(
    `✅ ${salidaNombre} — ${totalLetras}/27 letras, ${totalEntradas} entradas` +
      (letrasAusentes.length ? `  ⚠️  Faltan: ${letrasAusentes.join(", ")}` : ""),
  );
}
