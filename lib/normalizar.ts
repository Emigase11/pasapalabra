const SIN_TILDE: Record<string, string> = {
  á: "a",
  à: "a",
  ä: "a",
  â: "a",
  é: "e",
  è: "e",
  ë: "e",
  ê: "e",
  í: "i",
  ì: "i",
  ï: "i",
  î: "i",
  ó: "o",
  ò: "o",
  ö: "o",
  ô: "o",
  ú: "u",
  ù: "u",
  ü: "u",
  û: "u",
};

/**
 * Normaliza una respuesta para compararla: minúsculas, sin tildes/diéresis
 * y sin espacios. La "ñ" se conserva porque es una letra distinta en español.
 */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFC")
    .replace(/\s+/g, "")
    .split("")
    .map((c) => SIN_TILDE[c] ?? c)
    .join("");
}
