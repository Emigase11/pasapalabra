/**
 * Efectos de sonido generados con Web Audio API (sin archivos externos).
 * El contexto se crea perezosamente en el primer uso (requiere gesto del usuario).
 */

let ctx: AudioContext | null = null;

function getContexto(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new AudioContext();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tono(
  frecuencia: number,
  duracion: number,
  retardo = 0,
  tipo: OscillatorType = "sine",
  volumen = 0.15,
): void {
  const audio = getContexto();
  if (!audio) return;

  const inicio = audio.currentTime + retardo;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = tipo;
  osc.frequency.value = frecuencia;
  gain.gain.setValueAtTime(volumen, inicio);
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracion);

  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(inicio);
  osc.stop(inicio + duracion);
}

export const sonidos = {
  acierto(): void {
    tono(660, 0.12);
    tono(990, 0.18, 0.1);
  },
  error(): void {
    tono(220, 0.2, 0, "square", 0.08);
    tono(150, 0.3, 0.12, "square", 0.08);
  },
  pasapalabra(): void {
    tono(440, 0.08, 0, "triangle", 0.1);
  },
  fin(): void {
    tono(523, 0.15);
    tono(392, 0.15, 0.15);
    tono(330, 0.35, 0.3);
  },
};
