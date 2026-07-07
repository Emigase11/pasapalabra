"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DICCIONARIOS, DICCIONARIO_POR_DEFECTO } from "@/lib/diccionarios";

const TIEMPOS = [60, 150, 300] as const;
const TIEMPO_POR_DEFECTO = 150;

export default function Menu() {
  const router = useRouter();
  const [tiempo, setTiempo] = useState<number>(TIEMPO_POR_DEFECTO);
  const [diccionario, setDiccionario] = useState(DICCIONARIO_POR_DEFECTO.id);

  const empezar = () => {
    router.push(`/juego?tiempo=${tiempo}&dic=${diccionario}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-6">
      <div className="text-center">
        <h1 className="text-6xl font-black tracking-tight text-yellow-400 sm:text-7xl">
          PASAPALABRA
        </h1>
        <p className="mt-3 text-lg text-slate-400">El rosco de las 27 letras</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 rounded-2xl bg-slate-800/80 p-6">
        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-400">
            Tiempo
          </label>
          <div className="flex gap-2">
            {TIEMPOS.map((t) => (
              <button
                key={t}
                onClick={() => setTiempo(t)}
                className={`flex-1 rounded-xl py-2 font-bold transition-colors ${
                  tiempo === t
                    ? "bg-yellow-400 text-slate-900"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-400">
            Diccionario
          </label>
          <div className="flex gap-2">
            {DICCIONARIOS.map((d) => (
              <button
                key={d.id}
                onClick={() => setDiccionario(d.id)}
                className={`flex-1 rounded-xl py-2 font-bold transition-colors ${
                  diccionario === d.id
                    ? "bg-yellow-400 text-slate-900"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {d.nombre}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={empezar}
          className="rounded-xl bg-green-600 py-4 text-xl font-black uppercase tracking-wider text-white transition-colors hover:bg-green-500"
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
