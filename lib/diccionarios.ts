import type { Diccionario, Entrada } from "@/lib/tipos";
import generalFacil from "@/data/rosco-general-facil.json";
import generalMedia from "@/data/rosco-general-media.json";

/**
 * Registro de diccionarios disponibles.
 * Para agregar uno nuevo:
 * 1. Crear data/rosco-<id>.json (usar scripts/convertir-diccionario.ts).
 * 2. Importarlo acá y agregarlo a la lista con su categoria y dificultad.
 */
export const DICCIONARIOS: Diccionario[] = [
  { id: "general-facil", categoria: "General", dificultad: "Fácil",  entradas: generalFacil as Entrada[] },
  { id: "general-media", categoria: "General", dificultad: "Media",  entradas: generalMedia as Entrada[] },
];

/** Lista de categorías únicas en el orden en que aparecen. */
export const CATEGORIAS: string[] = DICCIONARIOS.reduce<string[]>(
  (acc, d) => (acc.includes(d.categoria) ? acc : [...acc, d.categoria]),
  [],
);

/** Todos los diccionarios de una categoría dada. */
export function diccionariosPorCategoria(categoria: string): Diccionario[] {
  return DICCIONARIOS.filter((d) => d.categoria === categoria);
}

export const DICCIONARIO_POR_DEFECTO = DICCIONARIOS[0];

export function obtenerDiccionario(id: string | null): Diccionario {
  return DICCIONARIOS.find((d) => d.id === id) ?? DICCIONARIO_POR_DEFECTO;
}
