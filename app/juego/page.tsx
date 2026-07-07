"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Rosco from "@/components/Rosco";
import PanelJuego from "@/components/PanelJuego";
import { useJuego } from "@/hooks/useJuego";
import { obtenerDiccionario } from "@/lib/diccionarios";
import type { Diccionario, MotivoPausa, MotivoFin } from "@/lib/tipos";

const TIEMPO_POR_DEFECTO = 150;

const TITULOS_FIN: Record<MotivoFin, string> = {
  completado: "¡Rosco completado!",
  tiempo: "¡Se acabó el tiempo!",
  plantado: "Te plantaste",
};

function Partida({ diccionario, tiempoTotal }: { diccionario: Diccionario; tiempoTotal: number }) {
  const juego = useJuego({ entradas: diccionario.entradas, tiempoTotal });
  const letras = diccionario.entradas.map((e) => e.letra);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 lg:flex-row lg:gap-12">
      {/* El rosco muestra el highlight activo tanto jugando como pausado */}
      <Rosco
        letras={letras}
        estados={juego.estados}
        indiceActual={juego.indiceActual}
        jugando={juego.fase !== "terminado"}
      />

      {juego.fase !== "terminado" ? (
        <PanelJuego
          entrada={juego.entradaActual}
          tiempoRestante={juego.tiempoRestante}
          aciertos={juego.aciertos}
          errores={juego.errores}
          fasePausa={
            juego.fase === "pausado_pasapalabra" ? "pasapalabra" :
            juego.fase === "pausado_error" ? "error" :
            null as MotivoPausa | null
          }
          ultimoError={juego.ultimoError}
          onResponder={juego.responder}
          onPasapalabra={juego.pasapalabra}
          onContinuar={juego.continuar}
          onPlantarse={juego.plantarse}
        />
      ) : (
        <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-slate-800/80 p-8 text-center">
          <h2 className="text-3xl font-black text-yellow-400">
            {juego.motivoFin ? TITULOS_FIN[juego.motivoFin] : ""}
          </h2>
          <div className="flex gap-8">
            <div>
              <div className="text-5xl font-bold text-green-400">{juego.aciertos}</div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Aciertos</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-red-400">{juego.errores}</div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Errores</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-slate-200">{juego.tiempoUsado}s</div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Tiempo</div>
            </div>
          </div>
          <div className="flex w-full gap-3">
            <button
              onClick={juego.reiniciar}
              className="flex-1 rounded-xl bg-green-600 py-3 font-bold text-white transition-colors hover:bg-green-500"
            >
              Jugar de nuevo
            </button>
            <Link
              href="/"
              className="flex-1 rounded-xl bg-slate-700 py-3 text-center font-bold text-white transition-colors hover:bg-slate-600"
            >
              Menú
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

function JuegoConParametros() {
  const params = useSearchParams();
  const diccionario = obtenerDiccionario(params.get("dic"));
  const tiempo = Number(params.get("tiempo"));
  const tiempoTotal = Number.isFinite(tiempo) && tiempo > 0 ? tiempo : TIEMPO_POR_DEFECTO;

  return <Partida key={`${diccionario.id}-${tiempoTotal}`} diccionario={diccionario} tiempoTotal={tiempoTotal} />;
}

export default function PaginaJuego() {
  return (
    <Suspense>
      <JuegoConParametros />
    </Suspense>
  );
}
