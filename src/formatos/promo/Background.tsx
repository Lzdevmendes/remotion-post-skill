import React from "react";
import { AbsoluteFill } from "remotion";
import { usePromo, rgba } from "./PromoContext";

/** Fundo escuro com focos de luz da marca borrados, feixe diagonal e granulação. */
export const Background: React.FC<{ f: number; glowY?: number; boost?: number }> = ({ f, glowY = 0, boost = 0 }) => {
  const { brand } = usePromo();
  const BRAND = { bg: brand.cores.fundoClaro, glow: brand.cores.acento };
  const pulse = 0.82 + 0.18 * Math.sin(f / 70);
  const driftA = Math.sin(f / 240) * 60;
  const driftB = Math.cos(f / 300) * 80;
  const beamX = -300 + ((f * 0.9) % 2600);
  return (
    <AbsoluteFill style={{ background: BRAND.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 540 - 800,
          top: glowY - 700,
          width: 1600,
          height: 1400,
          background: `radial-gradient(closest-side, ${rgba(BRAND.glow, 0.34)}, ${rgba(BRAND.glow2, 0.16)} 45%, ${rgba(BRAND.glow2, 0)} 100%)`,
          opacity: pulse * (1 + boost),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -420 + driftA,
          top: -260 + driftB * 0.5,
          width: 1100,
          height: 1100,
          background: `radial-gradient(closest-side, ${rgba(BRAND.glow, 0.16)}, ${rgba(BRAND.glow, 0)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 380 - driftB,
          top: 1350 + driftA,
          width: 1200,
          height: 1200,
          background: `radial-gradient(closest-side, ${rgba(BRAND.glow2, 0.2)}, ${rgba(BRAND.glow2, 0)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: beamX,
          top: -600,
          width: 220,
          height: 3200,
          transform: "rotate(32deg)",
          background: `linear-gradient(90deg, ${rgba(BRAND.glow, 0)}, ${rgba(BRAND.glow, 0.07)} 50%, ${rgba(BRAND.glow, 0)})`,
        }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(f / 3) % 20} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/**
 * Escurece o terço de cima (onde ficam as legendas) e a base.
 * O topo é sólido até ~570px de propósito: com a câmera aproximada a janela
 * branca invade essa área e a legenda fica ilegível por cima dela.
 */
export const Vignette: React.FC<{ top?: number; bottom?: number }> = ({ top = 1, bottom = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: 860,
        opacity: top,
        background:
          "linear-gradient(180deg, rgba(11,12,16,.98) 0%, rgba(11,12,16,.97) 66%, rgba(11,12,16,.7) 80%, rgba(11,12,16,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 320,
        opacity: bottom,
        background: "linear-gradient(0deg, rgba(11,12,16,.92) 0%, rgba(11,12,16,.5) 45%, rgba(11,12,16,0) 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)",
      }}
    />
  </AbsoluteFill>
);
