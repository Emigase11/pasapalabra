import type { Diccionario, Entrada } from "@/lib/tipos";
import rosco from "@/data/rosco.json";
import roscoCine from "@/data/rosco-cine.json";
import roscoGeneralMedia from "@/data/rosco-general-media.json";

/**
 * Registro de diccionarios disponibles. Para agregar uno nuevo:
 * 1. Crear data/rosco-<id>.json con 27 entradas (A-Z + Ñ).
 * 2. Importarlo acá y sumarlo a la lista.
 */
export const DICCIONARIOS: Diccionario[] = [
  { id: "clasico",       nombre: "Clásico",        entradas: rosco as Entrada[] },
  { id: "cine",          nombre: "Cine",            entradas: roscoCine as Entrada[] },
  { id: "general-media", nombre: "General",         entradas: roscoGeneralMedia as Entrada[] },
];

export const DICCIONARIO_POR_DEFECTO = DICCIONARIOS[0];

export function obtenerDiccionario(id: string | null): Diccionario {
  return DICCIONARIOS.find((d) => d.id === id) ?? DICCIONARIO_POR_DEFECTO;
}
