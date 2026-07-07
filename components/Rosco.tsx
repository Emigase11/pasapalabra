"use client";

import type { EstadoLetra } from "@/lib/tipos";

interface RoscoProps {
  letras: string[];
  estados: EstadoLetra[];
  indiceActual: number;
  jugando: boolean;
}

const TAMANO = 420;
const CENTRO = TAMANO / 2;
const RADIO_ROSCO = 182;
const RADIO_LETRA = 20;

const COLORES: Record<EstadoLetra, { fill: string; stroke: string; texto: string }> = {
  pendiente: { fill: "#1e293b", stroke: "#e2e8f0", texto: "#e2e8f0" },
  correcta: { fill: "#16a34a", stroke: "#4ade80", texto: "#ffffff" },
  incorrecta: { fill: "#dc2626", stroke: "#f87171", texto: "#ffffff" },
  pasapalabra: { fill: "#2563eb", stroke: "#60a5fa", texto: "#ffffff" },
};

/** Posición de cada letra sobre la circunferencia, empezando arriba (-90°). */
function posicion(indice: number, total: number): { x: number; y: number } {
  const angulo = (indice / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: CENTRO + RADIO_ROSCO * Math.cos(angulo),
    y: CENTRO + RADIO_ROSCO * Math.sin(angulo),
  };
}

export default function Rosco({ letras, estados, indiceActual, jugando }: RoscoProps) {
  return (
    <svg
      viewBox={`0 0 ${TAMANO} ${TAMANO}`}
      className="w-full max-w-[min(90vw,520px)]"
      role="img"
      aria-label="Rosco de Pasapalabra"
    >
      {/* Letra actual en el centro */}
      {jugando && (
        <text
          x={CENTRO}
          y={CENTRO}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-yellow-400 font-bold"
          fontSize={110}
        >
          {letras[indiceActual]}
        </text>
      )}

      {letras.map((letra, i) => {
        const { x, y } = posicion(i, letras.length);
        const esActual = jugando && i === indiceActual;
        const color = COLORES[estados[i]];
        const fill = esActual ? "#facc15" : color.fill;
        const stroke = esActual ? "#fde047" : color.stroke;
        const texto = esActual ? "#1e293b" : color.texto;

        return (
          <g key={letra} className={esActual ? "animate-pulse" : undefined}>
            <circle
              cx={x}
              cy={y}
              r={esActual ? RADIO_LETRA + 3 : RADIO_LETRA}
              fill={fill}
              stroke={stroke}
              strokeWidth={2.5}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={texto}
              fontSize={esActual ? 24 : 20}
              fontWeight="bold"
            >
              {letra}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
