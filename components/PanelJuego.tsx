"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { Entrada } from "@/lib/tipos";

interface PanelJuegoProps {
  entrada: Entrada;
  tiempoRestante: number;
  aciertos: number;
  errores: number;
  pausado: boolean;
  onResponder: (respuesta: string) => void;
  onPasapalabra: () => void;
  onContinuar: () => void;
  onPlantarse: () => void;
}

function formatearTiempo(segundos: number): string {
  const s = Math.max(segundos, 0);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function pista(entrada: Entrada): string {
  return entrada.tipo === "empieza"
    ? `Empieza por ${entrada.letra}`
    : `Contiene la ${entrada.letra}`;
}

export default function PanelJuego({
  entrada,
  tiempoRestante,
  aciertos,
  errores,
  pausado,
  onResponder,
  onPasapalabra,
  onContinuar,
  onPlantarse,
}: PanelJuegoProps) {
  const [respuesta, setRespuesta] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const continuarRef = useRef<HTMLButtonElement>(null);

  // Foco automático: al input cuando se juega, al botón Continuar cuando se pausa.
  useEffect(() => {
    if (pausado) {
      continuarRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [pausado, entrada]);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (respuesta.trim() === "") return;
    onResponder(respuesta);
    setRespuesta("");
  };

  const pasar = () => {
    setRespuesta("");
    onPasapalabra();
  };

  // Atajos durante la partida activa.
  const atajoInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowRight" || (e.key === " " && respuesta.trim() === "")) {
      e.preventDefault();
      pasar();
    }
  };

  const pocoTiempo = !pausado && tiempoRestante <= 10;

  const marcador = (
    <div className="flex gap-4 text-center">
      <div>
        <div className="text-3xl font-bold text-green-400">{aciertos}</div>
        <div className="text-xs uppercase tracking-wide text-slate-400">Aciertos</div>
      </div>
      <div>
        <div className="text-3xl font-bold text-red-400">{errores}</div>
        <div className="text-xs uppercase tracking-wide text-slate-400">Errores</div>
      </div>
    </div>
  );

  // ── Estado pausado ──────────────────────────────────────────────────────────
  if (pausado) {
    return (
      <div className="flex w-full max-w-md flex-col gap-4 transition-all">
        {/* Cronómetro congelado */}
        <div className="flex items-center justify-between rounded-2xl bg-slate-800/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="font-mono text-5xl font-bold tabular-nums text-slate-400">
              {formatearTiempo(tiempoRestante)}
            </div>
            <span className="rounded-lg bg-slate-700 px-2 py-1 text-xs font-black uppercase tracking-widest text-slate-300">
              ⏸ PAUSADO
            </span>
          </div>
          {marcador}
        </div>

        {/* Pantalla de pausa */}
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-slate-800/80 px-6 py-8 text-center">
          <p className="text-base text-slate-400">
            Preparate para la siguiente letra
          </p>
          <button
            ref={continuarRef}
            onClick={onContinuar}
            className="w-full rounded-xl bg-blue-600 py-4 text-xl font-black text-white shadow-lg shadow-blue-900/40 transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            Continuar →
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Enter o Espacio = continuar
        </p>
      </div>
    );
  }

  // ── Estado jugando ──────────────────────────────────────────────────────────
  return (
    <div className="flex w-full max-w-md flex-col gap-4 transition-all">
      {/* Cronómetro y marcador */}
      <div className="flex items-center justify-between rounded-2xl bg-slate-800/80 px-6 py-4">
        <div
          className={`font-mono text-5xl font-bold tabular-nums ${
            pocoTiempo ? "animate-pulse text-red-400" : "text-yellow-400"
          }`}
        >
          {formatearTiempo(tiempoRestante)}
        </div>
        {marcador}
      </div>

      {/* Pista y definición */}
      <div className="rounded-2xl bg-slate-800/80 px-6 py-5">
        <div className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-400">
          {pista(entrada)}
        </div>
        <p className="text-lg leading-relaxed text-slate-100">{entrada.definicion}</p>
      </div>

      {/* Input y acciones */}
      <form onSubmit={enviar} className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="text"
          value={respuesta}
          onChange={(e) => setRespuesta(e.target.value)}
          onKeyDown={atajoInput}
          placeholder="Escribí tu respuesta…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="rounded-xl border-2 border-slate-600 bg-slate-900 px-4 py-3 text-lg text-white placeholder-slate-500 outline-none transition-colors focus:border-yellow-400"
        />
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-green-600 py-3 text-lg font-bold text-white transition-colors hover:bg-green-500"
          >
            Responder
          </button>
          <button
            type="button"
            onClick={pasar}
            className="flex-1 rounded-xl bg-blue-600 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-500"
          >
            Pasapalabra
          </button>
        </div>
        <button
          type="button"
          onClick={onPlantarse}
          className="rounded-xl border border-slate-600 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800"
        >
          Me planto
        </button>
      </form>

      <p className="text-center text-xs text-slate-500">
        Enter = responder · Espacio (input vacío) o → = pasapalabra
      </p>
    </div>
  );
}
