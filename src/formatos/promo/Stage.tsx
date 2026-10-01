import React from "react";
import { AbsoluteFill } from "remotion";
import { usePromo, rgba } from "./PromoContext";
export const APP_W = 1280;
export const APP_H = 800;

export const CHROME = 44;
export const WIN_W = APP_W;
export const WIN_H = APP_H + CHROME;

/**
 * Câmera: (fx, fy) é o ponto da JANELA que fica no centro horizontal da tela,
 * na altura `cy` do vídeo. `s` = zoom, rx/ry/rz = inclinação em graus,
 * z = distância (negativo afasta), o = opacidade da janela.
 */
export type Cam = { fx: number; fy: number; s: number; rx: number; ry: number; rz: number; z: number; cy: number; o: number };

export const Stage: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: `540px ${cam.cy}px` }}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        transformStyle: "preserve-3d",
        opacity: cam.o < 0.999 ? cam.o : undefined,
        transform: `translate3d(540px, ${cam.cy}px, ${cam.z}px) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) rotateZ(${cam.rz}deg) scale(${cam.s}) translate(${-cam.fx}px, ${-cam.fy}px)`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** Janela de navegador com vidro, sombra e brilho da marca em volta. */
export const BrowserWindow: React.FC<{ title: string; sheen: number; children: React.ReactNode }> = ({ title, sheen, children }) => {
  const { brand } = usePromo();
  return (
  <>
    <div
      style={{
        position: "absolute",
        left: -30,
        top: -30,
        width: WIN_W + 60,
        height: WIN_H + 60,
        borderRadius: 40,
        boxShadow: `0 0 160px 40px ${rgba(brand.cores.acento, 0.26)}, 0 60px 120px rgba(0,0,0,.55)`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: WIN_W,
        height: WIN_H,
        borderRadius: 16,
        overflow: "hidden",
        background: "#15130F",
        boxShadow: "0 20px 50px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.1)",
      }}
    >
      <div
        style={{
          height: CHROME,
          background: "linear-gradient(180deg, #221F1B, #1A1815)",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          position: "relative",
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 6, background: c, marginRight: 8, opacity: 0.9 }} />
        ))}
        <div
          style={{
            position: "absolute",
            left: WIN_W / 2 - 170,
            width: 340,
            height: 26,
            borderRadius: 8,
            background: "rgba(255,255,255,.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            color: "#A89C90",
            fontFamily: brand.fontes.texto,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <svg width="10" height="12" viewBox="0 0 10 12">
            <rect x="1" y="5" width="8" height="6.5" rx="1.5" fill="#A89C90" />
            <path d="M3 5 V3.5 a2 2 0 0 1 4 0 V5" stroke="#A89C90" strokeWidth="1.4" fill="none" />
          </svg>
          {title}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: CHROME, width: APP_W, height: APP_H, overflow: "hidden" }}>
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(115deg, rgba(255,255,255,0) ${20 + sheen * 20}%, rgba(255,255,255,.07) ${32 + sheen * 20}%, rgba(255,255,255,0) ${44 + sheen * 20}%)`,
        }}
      />
      <div
        style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.1)" }}
      />
    </div>
  </>
  );
}

/** Elemento flutuando acima do plano da janela (efeito de profundidade). x/y em coordenadas da janela. */
export const Float: React.FC<{
  x: number;
  y: number;
  z: number;
  scale?: number;
  opacity?: number;
  children: React.ReactNode;
}> = ({ x, y, z, scale = 1, opacity = 1, children }) =>
  opacity <= 0.001 ? null : (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 0,
        height: 0,
        transform: `translate3d(0, 0, ${z}px)`,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </div>
  );
