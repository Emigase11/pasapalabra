export type TipoPista = "empieza" | "contiene";

export interface Entrada {
  letra: string;
  palabra: string;
  definicion: string;
  tipo: TipoPista;
}

export type EstadoLetra = "pendiente" | "correcta" | "incorrecta" | "pasapalabra";

export type FaseJuego = "jugando" | "pausado_pasapalabra" | "terminado";

export type MotivoFin = "completado" | "tiempo" | "plantado";

export interface Diccionario {
  id: string;
  nombre: string;
  entradas: Entrada[];
}
