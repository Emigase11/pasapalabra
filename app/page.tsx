"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORIAS,
  DICCIONARIO_POR_DEFECTO,
  diccionariosPorCategoria,
} from "@/lib/diccionarios";

const TIEMPOS_PRESET = [60, 150, 300] as const;
const TIEMPO_POR_DEFECTO = 150;
const LS_KEY = "pasapalabra_tiempo_personalizado";
const MIN_SEG = 30;
const MAX_SEG = 600;

function formatearTiempo(s: number): string {
  const t = Math.max(s, 0);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

function validar(total: number): string | null {
  if (!Number.isInteger(total) || total < MIN_SEG)
    return `Mínimo ${MIN_SEG} segundos (0:30)`;
  if (total > MAX_SEG)
    return `Máximo ${MAX_SEG} segundos (${formatearTiempo(MAX_SEG)})`;
  return null;
}

export default function Menu() {
  const router = useRouter();

  // ── Tiempo ─────────────────────────────────────────────────────────────────
  const [modoTiempo, setModoTiempo] = useState<"preset" | "personalizado">("preset");
  const [tiempoPreset, setTiempoPreset] = useState(TIEMPO_POR_DEFECTO);
  const [minutos, setMinutos] = useState(2);
  const [segs, setSegs] = useState(30);
  const minutosRef = useRef<HTMLInputElement>(null);

  // ── Categoría + dificultad ─────────────────────────────────────────────────
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [diccionario, setDiccionario] = useState(DICCIONARIO_POR_DEFECTO.id);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Recuperar último tiempo personalizado de localStorage.
  useEffect(() => {
    const guardado = Number(localStorage.getItem(LS_KEY));
    if (Number.isFinite(guardado) && guardado >= MIN_SEG && guardado <= MAX_SEG) {
      setMinutos(Math.floor(guardado / 60));
      setSegs(guardado % 60);
    }
  }, []);

  // Foco automático al activar modo personalizado.
  useEffect(() => {
    if (modoTiempo === "personalizado") minutosRef.current?.focus();
  }, [modoTiempo]);

  // Cierra el dropdown al hacer click fuera.
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownAbierto(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const seleccionarCategoria = (cat: string) => {
    setCategoria(cat);
    setDropdownAbierto(false);
    const primero = diccionariosPorCategoria(cat)[0];
    if (primero) setDiccionario(primero.id);
  };

  const total = minutos * 60 + segs;
  const error = modoTiempo === "personalizado" ? validar(total) : null;
  const tiempoFinal = modoTiempo === "preset" ? tiempoPreset : total;
  const puedeEmpezar = error === null;

  const cambiarMinutos = (v: string) => {
    const n = Math.min(Math.max(parseInt(v) || 0, 0), 10);
    setMinutos(n);
    if (n === 10) setSegs(0);
  };

  const cambiarSegs = (v: string) => {
    if (minutos === 10) { setSegs(0); return; }
    setSegs(Math.min(Math.max(parseInt(v) || 0, 0), 59));
  };

  const empezar = () => {
    if (!puedeEmpezar) return;
    if (modoTiempo === "personalizado")
      localStorage.setItem(LS_KEY, String(tiempoFinal));
    router.push(`/juego?tiempo=${tiempoFinal}&dic=${diccionario}&s=${Date.now()}`);
  };

  const chip = (activo: boolean) =>
    `rounded-xl py-2 font-bold transition-colors ${
      activo
        ? "bg-yellow-400 text-slate-900"
        : "bg-slate-700 text-slate-300 hover:bg-slate-600"
    }`;

  const dificultades = diccionariosPorCategoria(categoria);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tight text-yellow-400 sm:text-7xl">
          PASAPALABRA
        </h1>
        <p className="mt-3 text-lg text-slate-400">El rosco de las 27 letras</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-slate-800/80 p-6">

        {/* ── Selector de tiempo ────────────────────────────────────── */}
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-400">
            Tiempo
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIEMPOS_PRESET.map((t) => (
              <button
                key={t}
                onClick={() => { setTiempoPreset(t); setModoTiempo("preset"); }}
                className={chip(modoTiempo === "preset" && tiempoPreset === t)}
              >
                {formatearTiempo(t)}
              </button>
            ))}
            <button
              onClick={() => setModoTiempo("personalizado")}
              className={chip(modoTiempo === "personalizado")}
            >
              Personalizado
            </button>
          </div>

          {modoTiempo === "personalizado" && (
            <div className="mt-3 rounded-xl border border-slate-600 bg-slate-900/60 p-4">
              <div className="flex items-center justify-center gap-2">
                <div className="flex flex-col items-center">
                  <input
                    ref={minutosRef}
                    type="number"
                    min={0}
                    max={10}
                    value={minutos}
                    onChange={(e) => cambiarMinutos(e.target.value)}
                    className={`w-16 rounded-lg border-2 bg-slate-800 py-2 text-center text-2xl font-bold text-white outline-none transition-colors ${
                      error ? "border-red-500" : "border-slate-600 focus:border-yellow-400"
                    }`}
                  />
                  <span className="mt-1 text-xs text-slate-500">min</span>
                </div>
                <span className="mb-4 text-3xl font-bold text-slate-400">:</span>
                <div className="flex flex-col items-center">
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={segs}
                    onChange={(e) => cambiarSegs(e.target.value)}
                    className={`w-16 rounded-lg border-2 bg-slate-800 py-2 text-center text-2xl font-bold text-white outline-none transition-colors ${
                      error ? "border-red-500" : "border-slate-600 focus:border-yellow-400"
                    }`}
                  />
                  <span className="mt-1 text-xs text-slate-500">seg</span>
                </div>
              </div>
              {!error ? (
                <p className="mt-3 text-center font-mono text-2xl font-bold text-yellow-400">
                  ⏱ {formatearTiempo(total)}
                </p>
              ) : (
                <p className="mt-3 text-center text-sm font-semibold text-red-400">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* ── Selector de categoría ─────────────────────────────────── */}
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-400">
            Categoría
          </label>
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownAbierto((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl bg-slate-700 px-4 py-3 font-bold text-white transition-colors hover:bg-slate-600"
            >
              <span>{categoria}</span>
              <svg
                className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${dropdownAbierto ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownAbierto && (
              <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-slate-600 bg-slate-800 shadow-xl">
                {CATEGORIAS.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => seleccionarCategoria(cat)}
                      className={`flex w-full items-center justify-between px-4 py-3 font-bold transition-colors hover:bg-slate-700 ${
                        cat === categoria ? "text-yellow-400" : "text-white"
                      }`}
                    >
                      {cat}
                      {cat === categoria && (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Selector de dificultad ────────────────────────────────── */}
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-400">
            Dificultad
          </label>
          <div className="flex gap-2">
            {dificultades.map((d) => (
              <button
                key={d.id}
                onClick={() => setDiccionario(d.id)}
                className={`flex-1 ${chip(diccionario === d.id)}`}
              >
                {d.dificultad}
              </button>
            ))}
          </div>
        </div>

        {/* ── Empezar ───────────────────────────────────────────────── */}
        <button
          onClick={empezar}
          disabled={!puedeEmpezar}
          className="rounded-xl bg-green-600 py-4 text-xl font-black uppercase tracking-wider text-white transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Empezar
        </button>
      </div>

      <p className="max-w-md text-center text-sm text-slate-500">
        Respondé la palabra de cada letra antes de que se acabe el tiempo.
        Enter para responder · Espacio o → para pasapalabra.
      </p>
    </main>
  );
}
