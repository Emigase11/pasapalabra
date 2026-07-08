/**
 * Normaliza un string para comparar respuestas del jugador:
 * - Minúsculas
 * - Sin tildes ni diéresis (á→a, ü→u, etc.)
 * - ñ tratada como "n" (así "año" == "ano" — más permisivo con el jugador)
 * - Sin signos de puntuación, guiones, apóstrofes, puntos, etc.
 * - Espacios múltiples colapsados a uno; trim de extremos
 * - Números permitidos ("boeing 747" → "boeing 747")
 */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .trim()
    .normalize("NFD")               // separa letras de sus diacríticos (á → a + ́)
    .replace(/[̀-ͯ]/g, "") // elimina todos los diacríticos (tildes, diéresis…)
    .normalize("NFC")               // recompone (importante para la ñ)
    .replace(/ñ/g, "n")             // ñ → n (permisivo: "año" == "ano")
    .replace(/[^a-z0-9\s]/g, "")   // elimina signos, guiones, apóstrofes, etc.
    .replace(/\s+/g, " ")           // colapsa espacios múltiples
    .trim();
}

/** Compara la respuesta del jugador con la palabra correcta usando normalización. */
export function esRespuestaCorrecta(
  respuestaJugador: string,
  palabraCorrecta: string,
): boolean {
  return normalizar(respuestaJugador) === normalizar(palabraCorrecta);
}
