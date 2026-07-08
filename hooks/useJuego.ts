"use client";

import { useCallback, useEffect, useState } from "react";
import { esRespuestaCorrecta } from "@/lib/normalizar";
import { sonidos } from "@/lib/sonidos";
import type {
  Entrada,
  EstadoLetra,
  FaseJuego,
  MotivoFin,
  UltimoError,
} from "@/lib/tipos";

interface OpcionesJuego {
  entradas: Entrada[];
  tiempoTotal: number;
}

const FASES_PAUSA: FaseJuego[] = ["pausado_pasapalabra", "pausado_error"];

/** Busca la próxima letra jugable (pendiente o pasapalabra) en orden circular. */
function siguienteJugable(estados: EstadoLetra[], desde: number): number | null {
  const n = estados.length;
  for (let paso = 1; paso <= n; paso++) {
    const i = (desde + paso) % n;
    if (estados[i] === "pendiente" || estados[i] === "pasapalabra") return i;
  }
  return null;
}

export function useJuego({ entradas, tiempoTotal }: OpcionesJuego) {
  const [estados, setEstados] = useState<EstadoLetra[]>(() =>
    entradas.map(() => "pendiente"),
  );
  const [indiceActual, setIndiceActual] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(tiempoTotal);
  const [fase, setFase] = useState<FaseJuego>("jugando");
  const [motivoFin, setMotivoFin] = useState<MotivoFin | null>(null);
  const [ultimoError, setUltimoError] = useState<UltimoError | null>(null);

  const terminar = useCallback((motivo: MotivoFin) => {
    setFase("terminado");
    setMotivoFin(motivo);
    setUltimoError(null);
    sonidos.fin();
  }, []);

  // El intervalo solo corre mientras fase === "jugando".
  // Cualquier pausa mata el interval via cleanup; al reanudar, se recrea.
  useEffect(() => {
    if (fase !== "jugando") return;
    const id = setInterval(() => setTiempoRestante((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [fase]);

  // Fin de partida por tiempo agotado.
  useEffect(() => {
    if (fase === "jugando" && tiempoRestante <= 0) terminar("tiempo");
  }, [fase, tiempoRestante, terminar]);

  const responder = useCallback(
    (respuesta: string): boolean => {
      if (fase !== "jugando") return false;

      const entrada = entradas[indiceActual];
      const correcta = esRespuestaCorrecta(respuesta, entrada.palabra);
      const nuevos: EstadoLetra[] = [...estados];
      nuevos[indiceActual] = correcta ? "correcta" : "incorrecta";
      setEstados(nuevos);

      if (correcta) {
        sonidos.acierto();
        const siguiente = siguienteJugable(nuevos, indiceActual);
        if (siguiente === null) terminar("completado");
        else setIndiceActual(siguiente);
        return true;
      }

      // Respuesta incorrecta: pausa para mostrar la corrección.
      sonidos.error();
      const siguiente = siguienteJugable(nuevos, indiceActual);
      if (siguiente === null) {
        // Era la última letra jugable; terminar sin mostrar pausa.
        terminar("completado");
        return false;
      }

      setUltimoError({
        respuestaJugador: respuesta.trim(),
        respuestaCorrecta: entrada.palabra,
        definicion: entrada.definicion,
        letra: entrada.letra,
      });
      setIndiceActual(siguiente);
      setFase("pausado_error");
      return false;
    },
    [fase, entradas, indiceActual, estados, terminar],
  );

  /**
   * Marca la letra actual como pasapalabra, pausa el cronómetro y
   * apunta al siguiente índice. El jugador debe presionar Continuar
   * para reanudar (y así no leer la siguiente definición con tiempo detenido).
   */
  const pasapalabra = useCallback(() => {
    if (fase !== "jugando") return;

    const nuevos: EstadoLetra[] = [...estados];
    nuevos[indiceActual] = "pasapalabra";
    setEstados(nuevos);
    sonidos.pasapalabra();

    const siguiente = siguienteJugable(nuevos, indiceActual);
    if (siguiente === null) {
      terminar("completado");
      return;
    }

    setIndiceActual(siguiente);
    setFase("pausado_pasapalabra");
  }, [fase, estados, indiceActual, terminar]);

  /** Reanuda el cronómetro desde cualquier estado de pausa. */
  const continuar = useCallback(() => {
    if (!FASES_PAUSA.includes(fase)) return;
    setUltimoError(null);
    setFase("jugando");
  }, [fase]);

  const plantarse = useCallback(() => {
    if (fase !== "jugando") return;
    terminar("plantado");
  }, [fase, terminar]);

  const reiniciar = useCallback(() => {
    setEstados(entradas.map(() => "pendiente"));
    setIndiceActual(0);
    setTiempoRestante(tiempoTotal);
    setFase("jugando");
    setMotivoFin(null);
    setUltimoError(null);
  }, [entradas, tiempoTotal]);

  const aciertos = estados.filter((e) => e === "correcta").length;
  const errores = estados.filter((e) => e === "incorrecta").length;

  return {
    estados,
    indiceActual,
    entradaActual: entradas[indiceActual],
    tiempoRestante,
    tiempoUsado: tiempoTotal - Math.max(tiempoRestante, 0),
    fase,
    motivoFin,
    ultimoError,
    aciertos,
    errores,
    responder,
    pasapalabra,
    continuar,
    plantarse,
    reiniciar,
  };
}
