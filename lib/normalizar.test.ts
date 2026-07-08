// Ejecutar con: npx tsx lib/normalizar.test.ts
import { normalizar, esRespuestaCorrecta } from "./normalizar";

let fallos = 0;

function assert(condicion: boolean, descripcion: string): void {
  if (condicion) {
    console.log("  ✓", descripcion);
  } else {
    console.error("  ✗", descripcion);
    fallos++;
  }
}

function eq(a: string, b: string, desc: string): void {
  assert(normalizar(a) === normalizar(b), desc);
}

function neq(a: string, b: string, desc: string): void {
  assert(normalizar(a) !== normalizar(b), desc);
}

console.log("\n── Deben ser IGUALES ──────────────────────────────────");
eq("Messi",          "messi",      'Messi == messi (mayúsculas)');
eq("MESSI",          "messi",      'MESSI == messi (todo mayúsculas)');
eq("átomo",          "atomo",      'átomo == atomo (tilde)');
eq("María",          "maria",      'María == maria (tilde)');
eq("España",         "espana",     'España == espana (ñ→n)');
eq("año",            "ano",        'año == ano (ñ→n permisivo)');
eq("  San Martín  ", "san martin", 'San Martín con espacios extra');
eq("D'Artagnan",     "dartagnan",  "D'Artagnan sin apóstrofe");
eq("Perú",           "peru",       'Perú == peru');
eq("Ñandú",          "nandu",      'Ñandú == nandu');
eq("Coca-Cola",      "cocacola",   'Coca-Cola sin guión');
eq("u.s.a",          "usa",        'u.s.a == usa');
eq("spider-man",     "spiderman",  'spider-man sin guión');
eq("boeing 747",     "boeing 747", 'boeing 747 con número');
eq("van gogh",       "van gogh",   'van gogh preserva espacio');
eq("mona lisa",      "mona lisa",  'mona lisa preserva espacio');
eq("  nilo  ",       "nilo",       'espacios extremos eliminados');
eq("galileo",        "Galileo",    'case-insensitive');

console.log("\n── Deben ser DISTINTAS ─────────────────────────────────");
neq("messi",   "mesi",   'messi != mesi (una s de diferencia)');
neq("boca",    "bocas",  'boca != bocas');
neq("rio",     "rios",   'rio != rios');
neq("paris",   "pariz",  'paris != pariz');

console.log("\n── esRespuestaCorrecta ─────────────────────────────────");
assert(esRespuestaCorrecta("atomo",   "átomo"),   'atomo == átomo');
assert(esRespuestaCorrecta("año",     "ano"),     'año == ano');
assert(esRespuestaCorrecta("espana",  "España"),  'espana == España');
assert(esRespuestaCorrecta("DARWIN",  "darwin"),  'DARWIN == darwin');
assert(!esRespuestaCorrecta("messi",  "mesi"),    'messi != mesi');
assert(!esRespuestaCorrecta("boca",   "bocas"),   'boca != bocas');

if (fallos === 0) {
  console.log(`\n✅  Todos los casos pasaron.\n`);
  process.exit(0);
} else {
  console.error(`\n❌  ${fallos} caso(s) fallaron.\n`);
  process.exit(1);
}
