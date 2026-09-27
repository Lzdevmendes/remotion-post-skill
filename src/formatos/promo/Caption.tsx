import React from "react";
import { EASE, SMOOTH, clamp, tw } from "./anim";
import { usePromo } from "./PromoContext";

export type CaptionData = {
  n: string; // "01"
  kicker: string; // rótulo curto em caixa alta
  lines: string[]; // 2 linhas de no máx. ~15 caracteres cada (118px condensada)
  accent: string[]; // palavras pintadas com o degradê da marca
  sub: string; // 1 linha, até ~52 caracteres
  inAt: number;
  outAt: number;
};

/** Palavra que entra subindo e desfocando (blur -> nítido) e sai subindo. */
export const Word: React.FC<{ f: number; at: number; outAt: number; children: string; accent?: boolean; dur?: number }> = ({
  f,
  at,
  outAt,
  children,
  accent,
  dur = 30,
}) => {
  const p = EASE(clamp((f - at) / dur));
  const o = SMOOTH(clamp((f - outAt) / 16));
  return (
    <span
      style={{
        display: "inline-block",
        opacity: p * (1 - o),
        transform: `translateY(${(1 - p) * 46 - o * 30}px)`,
        filter: `blur(${(1 - p) * 12 + o * 10}px)`,
        marginRight: "0.22em",
        ...(accent
          ? { backgroundImage: ACCENT_GRADIENT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", paddingRight: 4 }
          : {}),
      }}
    >
      {children}
    </span>
  );
};

/** Legenda numerada no terço de cima (fica por cima da vinheta sólida). */
export const Caption: React.FC<{ f: number; c: CaptionData }> = ({ f, c }) => {
  if (f < c.inAt - 2 || f > c.outAt + 24) return null;
  const kIn = tw(f, c.inAt, c.inAt + 24);
  const kOut = tw(f, c.outAt, c.outAt + 16, 0, 1, SMOOTH);
  const sIn = tw(f, c.inAt + 26, c.inAt + 50);
  let wi = 0;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 176 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 22px 10px 10px",
          borderRadius: 99,
          border: "1px solid rgba(255,255,255,.14)",
          background: "rgba(255,255,255,.05)",
          opacity: kIn * (1 - kOut),
          transform: `translateY(${(1 - kIn) * 20}px)`,
        }}
      >
        <span
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: `linear-gradient(135deg, ${BRAND.hi}, ${BRAND.lo})`,
            color: BRAND.onAccent,
            display: "grid",
            placeItems: "center",
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          {c.n}
        </span>
        <span style={{ fontFamily: fontBody, fontWeight: 600, fontSize: 26, letterSpacing: ".14em", textTransform: "uppercase", color: BRAND.pastel }}>
          {c.kicker}
        </span>
      </div>
      <div style={{ marginTop: 26, fontFamily: fontDisplay, fontWeight: 700, fontSize: 118, lineHeight: 0.98, color: BRAND.cream }}>
        {c.lines.map((line, li) => (
          <div key={li} style={{ whiteSpace: "nowrap" }}>
            {line.split(" ").map((w, i) => (
              <Word key={i} f={f} at={c.inAt + 6 + wi++ * 5} outAt={c.outAt} accent={c.accent.includes(w)}>
                {w}
              </Word>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          fontFamily: fontBody,
          fontWeight: 500,
          fontSize: 34,
          lineHeight: 1.3,
          whiteSpace: "nowrap",
          color: BRAND.muted,
          opacity: sIn * (1 - kOut),
          transform: `translateY(${(1 - sIn) * 16}px)`,
        }}
      >
        {c.sub}
      </div>
    </div>
  );
};
