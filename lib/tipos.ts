export type TipoPista = "empieza" | "contiene";

export interface Entrada {
  letra: string;
  palabra: string;
  definicion: string;
  tipo: TipoPista;
}

export type EstadoLetra = "pendiente" | "correcta" | "incorrecta" | "pasapalabra";

export type FaseJuego =
  | "jugando"
  | "pausado_pasapalabra"
  | "pausado_error"
  | "terminado";

export type MotivoPausa = "pasapalabra" | "error";

export type MotivoFin = "completado" | "tiempo" | "plantado";

export interface UltimoError {
  respuestaJugador: string;
  respuestaCorrecta: string;
  definicion: string;
  letra: string;
}

export interface Diccionario {
  id: string;
  nombre: string;
  entradas: Entrada[];
}
