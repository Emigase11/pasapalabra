import type { Diccionario, Entrada } from "@/lib/tipos";

import generalFacil    from "@/data/rosco-general-facil.json";
import generalMedia    from "@/data/rosco-general-media.json";

import deportesFacil   from "@/data/rosco-deportes-facil.json";
import deportesMedia   from "@/data/rosco-deportes-media.json";
import deportesDificil from "@/data/rosco-deportes-dificil.json";

import futbolFacil     from "@/data/rosco-futbol-facil.json";
import futbolMedia     from "@/data/rosco-futbol-media.json";
import futbolDificil   from "@/data/rosco-futbol-dificil.json";

import historiaFacil   from "@/data/rosco-historia-facil.json";
import historiaMedia   from "@/data/rosco-historia-media.json";
import historiaDificil from "@/data/rosco-historia-dificil.json";

const ORDEN_LETRAS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z",
];

/**
 * Recibe el pool completo de entradas (con múltiples candidatos por letra)
 * y devuelve 27 entradas — una aleatoria por letra — en orden canónico.
 */
export function sortearEntradas(pool: Entrada[]): Entrada[] {
  const porLetra = new Map<string, Entrada[]>();
  for (const e of pool) {
    if (!porLetra.has(e.letra)) porLetra.set(e.letra, []);
    porLetra.get(e.letra)!.push(e);
  }
  return ORDEN_LETRAS.map((letra) => {
    const candidatos = porLetra.get(letra) ?? [];
    if (candidatos.length === 0) throw new Error(`Falta la letra ${letra}`);
    return candidatos[Math.floor(Math.random() * candidatos.length)];
  });
}

export const DICCIONARIOS: Diccionario[] = [
  { id: "general-facil",    categoria: "General",   dificultad: "Fácil",   entradas: generalFacil    as Entrada[] },
  { id: "general-media",    categoria: "General",   dificultad: "Media",   entradas: generalMedia    as Entrada[] },

  { id: "deportes-facil",   categoria: "Deportes",  dificultad: "Fácil",   entradas: deportesFacil   as Entrada[] },
  { id: "deportes-media",   categoria: "Deportes",  dificultad: "Media",   entradas: deportesMedia   as Entrada[] },
  { id: "deportes-dificil", categoria: "Deportes",  dificultad: "Difícil", entradas: deportesDificil as Entrada[] },

  { id: "futbol-facil",     categoria: "Fútbol",    dificultad: "Fácil",   entradas: futbolFacil     as Entrada[] },
  { id: "futbol-media",     categoria: "Fútbol",    dificultad: "Media",   entradas: futbolMedia     as Entrada[] },
  { id: "futbol-dificil",   categoria: "Fútbol",    dificultad: "Difícil", entradas: futbolDificil   as Entrada[] },

  { id: "historia-facil",   categoria: "Historia",  dificultad: "Fácil",   entradas: historiaFacil   as Entrada[] },
  { id: "historia-media",   categoria: "Historia",  dificultad: "Media",   entradas: historiaMedia   as Entrada[] },
  { id: "historia-dificil", categoria: "Historia",  dificultad: "Difícil", entradas: historiaDificil as Entrada[] },
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
