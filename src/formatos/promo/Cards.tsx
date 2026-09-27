import React from "react";
import { EASE, SMOOTH, clamp } from "./anim";
import { usePromo, rgba } from "./PromoContext";
import { Float } from "./Stage";

/**
 * Aviso do sistema ("Produto salvo") saltando para fora da tela.
 * Fonte 25px de propósito: menor que isso some no celular.
 */
export const Toast: React.FC<{ f: number; at: number; dur: number; x: number; y: number; text: string }> = ({ f, at, dur, x, y, text }) => {
  const { brand } = usePromo();
  const BRAND = { bg: brand.cores.fundoClaro, text: brand.cores.textoEscuro || "#111", glow: brand.cores.acento };
  const fontBody = brand.fontes.corpo;
  const i = EASE(clamp((f - at) / 22));
  const o = SMOOTH(clamp((f - at - dur) / 14));
  return (
    <Float x={x} y={y + (1 - i) * 40} z={30 + 120 * i} scale={0.8 + 0.2 * i} opacity={i * (1 - o)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "18px 30px 18px 18px",
          borderRadius: 16,
          background: bg,
          color: fg,
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: 25,
          boxShadow: `0 22px 50px rgba(0,0,0,.4), 0 0 0 1px ${rgba(BRAND.glow, 0.25)}, 0 0 40px ${rgba(BRAND.glow, 0.25)}`,
        }}
      >
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            background: `linear-gradient(135deg, ${BRAND.hi}, ${BRAND.mid})`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M2.5 7.5 L5.6 10.4 L11.5 3.8" stroke={BRAND.onAccent} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {text}
      </div>
    </Float>
  );
};

/**
 * Card escuro de vidro que "descola" de um ponto da tela (from) e flutua em
 * profundidade até `to`, com o número que você quer que o espectador lembre.
 */
export const DepthCard: React.FC<{f: number; at: number; end: number; from: {x: number; y: number}; to: {x: number; y: number}; label: string; value: string; sub: string; }> = ({ f, at, end, from, to, label, value, sub }) => {
  const { brand } = usePromo();
  const BRAND = { bg: brand.cores.fundoClaro, text: brand.cores.textoEscuro || "#111", glow: brand.cores.acento };
  const fontDisplay = brand.fontes.titulo;
  const fontBody = brand.fontes.corpo;
  const ACCENT_GRADIENT = `linear-gradient(90deg, ${brand.cores.acento}, ${brand.cores.acento})`;
  const i = EASE(clamp((f - at) / 30));
  const o = SMOOTH(clamp((f - end) / 16));
  const bob = Math.sin((f - at) / 22) * 4;
  return (
    <Float
      x={from.x + (to.x - from.x) * i}
      y={from.y + (to.y - from.y) * i + bob}
      z={10 + 170 * i}
      scale={0.7 + 0.3 * i}
      opacity={Math.min(1, i * 1.6) * (1 - o)}
    >
      <div
        style={{
          padding: "16px 26px 18px",
          borderRadius: 18,
          background: "linear-gradient(150deg, rgba(40,30,22,.97), rgba(18,14,11,.97))",
          border: `1px solid ${rgba(BRAND.glow, 0.35)}`,
          boxShadow: `0 30px 70px rgba(0,0,0,.5), 0 0 60px ${rgba(BRAND.glow, 0.3)}`,
          fontFamily: fontBody,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: ".14em", textTransform: "uppercase", color: BRAND.pastel }}>{label}</div>
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 60,
            lineHeight: 1.05,
            backgroundImage: ACCENT_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {value}
        </div>
        {sub && <div style={{ fontSize: 16, color: BRAND.muted, fontWeight: 500 }}>{sub}</div>}
      </div>
    </Float>
  );
};
