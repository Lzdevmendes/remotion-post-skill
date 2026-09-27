import { Easing, interpolate } from "remotion";

// Easing pedido na especificação
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
// Para movimentos de câmera: começa e termina suave
export const CAM = Easing.bezier(0.55, 0, 0.15, 1);
export const SMOOTH = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Interpola de `from` para `to` entre os frames a e b. */
export function tw(
  f: number,
  a: number,
  b: number,
  from = 0,
  to = 1,
  easing: (t: number) => number = EASE,
) {
  return interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
}

/** Entra em [a, a+inDur] e sai em [b, b+outDur]. */
export function inOut(f: number, a: number, b: number, inDur = 18, outDur = 14) {
  return Math.min(tw(f, a, a + inDur), 1 - tw(f, b, b + outDur, 0, 1, SMOOTH));
}

/** Texto sendo digitado a partir do frame `start`, `perChar` frames por letra. */
export function typed(f: number, start: number, text: string, perChar = 3) {
  if (f < start) return "";
  const n = Math.floor((f - start) / perChar) + 1;
  return text.slice(0, Math.min(text.length, n));
}

export const typeEnd = (start: number, text: string, perChar = 3) =>
  start + (text.length - 1) * perChar;

/** Cursor de texto piscando. */
export const caretOn = (f: number) => Math.floor(f / 18) % 2 === 0;

/** Curva de "aperto" de botão: afunda rápido e volta com mola. */
export function press(f: number, at: number) {
  if (f < at || f > at + 16) return 0;
  if (f < at + 4) return (f - at) / 4;
  return 1 - EASE((f - at - 4) / 12);
}

type Key = { f: number } & Record<string, number>;

/**
 * Keyframes com propriedades parciais: cada chave herda o que não declarou
 * da anterior, então `{ f: 500 }` segura a pose até o frame 500.
 */
export function fillKeys<T extends Record<string, number>>(
  keys: Array<{ f: number } & Partial<T>>,
): Array<{ f: number } & T> {
  const out: Array<{ f: number } & T> = [];
  keys.forEach((k, i) => out.push({ ...(i ? out[i - 1] : {}), ...k } as { f: number } & T));
  return out;
}

export function keyed<T extends Record<string, number>>(
  f: number,
  keys: Array<{ f: number } & T>,
  ease: (t: number) => number = CAM,
): T {
  const strip = (k: Key) => {
    const { f: _f, ...rest } = k;
    return rest as unknown as T;
  };
  if (f <= keys[0].f) return strip(keys[0] as Key);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i] as Key;
    const b = keys[i + 1] as Key;
    if (f < b.f) {
      const t = ease((f - a.f) / (b.f - a.f));
      const out: Record<string, number> = {};
      for (const k of Object.keys(a)) if (k !== "f") out[k] = a[k] + (b[k] - a[k]) * t;
      return out as T;
    }
  }
  return strip(keys[keys.length - 1] as Key);
}

export function brl(v: number) {
  const [int, dec] = Math.abs(v).toFixed(2).split(".");
  return `R$ ${int.replace(/\B(?=(\d{3})+(?!\d))/g, ".")},${dec}`;
}
