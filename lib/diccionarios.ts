import type { Diccionario, Entrada } from "@/lib/tipos";

import generalFacil      from "@/data/general-facil.json";
import generalMedia      from "@/data/general-media.json";
import generalDificil    from "@/data/general-dificil.json";

import deportesFacil     from "@/data/deportes-facil.json";
import deportesMedia     from "@/data/deportes-media.json";
import deportesDificil   from "@/data/deportes-dificil.json";

import futbolFacil       from "@/data/futbol-facil.json";
import futbolMedia       from "@/data/futbol-media.json";
import futbolDificil     from "@/data/futbol-dificil.json";

import historiaFacil     from "@/data/historia-facil.json";
import historiaMedia     from "@/data/historia-media.json";
import historiaDificil   from "@/data/historia-dificil.json";

import geografiaFacil    from "@/data/geografia-facil.json";
import geografiaMedia    from "@/data/geografia-media.json";
import geografiaDificil  from "@/data/geografia-dificil.json";

const ORDEN_LETRAS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z",
];

const LS_HISTORIAL = "pasapalabra_historial";

type HistorialDic = Record<string, string[]>; // letra → palabras ya vistas

function leerHistorial(dicId: string): HistorialDic {
  try {
    const todo = JSON.parse(localStorage.getItem(LS_HISTORIAL) ?? "{}");
    return todo[dicId] ?? {};
  } catch { return {}; }
}

function guardarHistorial(dicId: string, historial: HistorialDic): void {
  try {
    const todo = JSON.parse(localStorage.getItem(LS_HISTORIAL) ?? "{}");
    todo[dicId] = historial;
    localStorage.setItem(LS_HISTORIAL, JSON.stringify(todo));
  } catch {}
}

/**
 * Recibe el pool completo de entradas y el id del diccionario.
 * Para cada letra elige aleatoriamente una palabra que no se haya visto
 * recientemente. Cuando se agotan las opciones de una letra, resetea
 * su historial y vuelve a usar todo el pool.
 * Persiste el historial en localStorage para que sobreviva entre sesiones.
 */
export function sortearEntradas(pool: Entrada[], dicId: string): Entrada[] {
  const historial = leerHistorial(dicId);

  const porLetra = new Map<string, Entrada[]>();
  for (const e of pool) {
    if (!porLetra.has(e.letra)) porLetra.set(e.letra, []);
    porLetra.get(e.letra)!.push(e);
  }

  const nuevoHistorial: HistorialDic = {};

  const entradas = ORDEN_LETRAS.map((letra) => {
    const candidatos = porLetra.get(letra) ?? [];
    if (candidatos.length === 0) throw new Error(`Falta la letra ${letra}`);

    const vistos = new Set(historial[letra] ?? []);
    const disponibles = candidatos.filter((c) => !vistos.has(c.palabra));
    // Si ya se usaron todas, reset esa letra
    const fuente = disponibles.length > 0 ? disponibles : candidatos;
    if (disponibles.length === 0) vistos.clear();

    const elegida = fuente[Math.floor(Math.random() * fuente.length)];
    nuevoHistorial[letra] = Array.from(vistos).concat(elegida.palabra);
    return elegida;
  });

  guardarHistorial(dicId, nuevoHistorial);
  return entradas;
}

export const DICCIONARIOS: Diccionario[] = [
  { id: "general-facil",    categoria: "General",   dificultad: "Fácil",   entradas: generalFacil    as Entrada[] },
  { id: "general-media",    categoria: "General",   dificultad: "Media",   entradas: generalMedia    as Entrada[] },
  { id: "general-dificil",  categoria: "General",   dificultad: "Difícil", entradas: generalDificil  as Entrada[] },

  { id: "deportes-facil",   categoria: "Deportes",  dificultad: "Fácil",   entradas: deportesFacil   as Entrada[] },
  { id: "deportes-media",   categoria: "Deportes",  dificultad: "Media",   entradas: deportesMedia   as Entrada[] },
  { id: "deportes-dificil", categoria: "Deportes",  dificultad: "Difícil", entradas: deportesDificil as Entrada[] },

  { id: "futbol-facil",     categoria: "Fútbol",    dificultad: "Fácil",   entradas: futbolFacil     as Entrada[] },
  { id: "futbol-media",     categoria: "Fútbol",    dificultad: "Media",   entradas: futbolMedia     as Entrada[] },
  { id: "futbol-dificil",   categoria: "Fútbol",    dificultad: "Difícil", entradas: futbolDificil   as Entrada[] },

  { id: "historia-facil",   categoria: "Historia",  dificultad: "Fácil",   entradas: historiaFacil   as Entrada[] },
  { id: "historia-media",   categoria: "Historia",  dificultad: "Media",   entradas: historiaMedia   as Entrada[] },
  { id: "historia-dificil", categoria: "Historia",  dificultad: "Difícil", entradas: historiaDificil as Entrada[] },

  { id: "geografia-facil",   categoria: "Geografía", dificultad: "Fácil",   entradas: geografiaFacil   as Entrada[] },
  { id: "geografia-media",   categoria: "Geografía", dificultad: "Media",   entradas: geografiaMedia   as Entrada[] },
  { id: "geografia-dificil", categoria: "Geografía", dificultad: "Difícil", entradas: geografiaDificil as Entrada[] },
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
