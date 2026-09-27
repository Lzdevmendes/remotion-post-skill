import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, Img, interpolate } from "remotion";
import { PromoContext } from "./promo/PromoContext";
import { Background } from "./promo/Background";
import { BrowserWindow, Stage, Cam, APP_W, APP_H, CHROME } from "./promo/Stage";
import { Caption } from "./promo/Caption";
import type { ArteProps, Slide } from "../tipos-post";
import { assetSrc } from "../blocos";

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

export const PromoSistema: React.FC<ArteProps> = ({ post, brand }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute scenes
  let currentFrame = 0;
  const scenes = post.slides.map((s, i) => {
    const dur = (s.duracao || 4) * fps;
    const scene = { start: currentFrame, end: currentFrame + dur, slide: s, index: i };
    currentFrame += dur;
    return scene;
  });

  const activeScene = scenes.find((s) => f >= s.start && f < s.end) || scenes[scenes.length - 1];

  // Dynamic Camera
  const sf = f - activeScene.start; // scene frame
  const dur = activeScene.end - activeScene.start;
  const isCapa = activeScene.slide.layout === "capa" || activeScene.slide.layout === "cta";
  
  const cam: Cam = {
    fx: APP_W / 2,
    fy: APP_H / 2,
    s: isCapa ? 1.5 : 0.84 + Math.sin(f / 100) * 0.05,
    rx: isCapa ? 0 : 12 + Math.sin(f / 90) * 2,
    ry: isCapa ? 0 : -8 + Math.sin(f / 120 + 1) * 2,
    rz: 0,
    z: isCapa ? -500 : 0,
    cy: 1100, // height of the 3d stage origin
    o: interpolate(sf, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  };

  // If previous was NOT capa and this IS capa, fade out.
  if (isCapa && activeScene.index > 0) {
    cam.o = 0; // Don't show browser in outro/cta
  }

  return (
    <PromoContext.Provider value={{ brand, post }}>
      <AbsoluteFill style={{ background: brand.cores.fundoClaro }}>
        <Background f={f} glowY={cam.cy} boost={isCapa ? 0.3 : 0} />
        
        {!isCapa && (
          <Stage cam={cam}>
            <BrowserWindow title={post.titulo} sheen={0.2}>
               {activeScene.slide.imagem && (
                 <Img 
                   src={assetSrc(post.id, activeScene.slide.imagem)} 
                   style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                 />
               )}
            </BrowserWindow>
          </Stage>
        )}

        {/* Captions / Text overlays */}
        {scenes.map((s) => {
          if (s.slide.layout === "capa" || s.slide.layout === "cta") return null;
          const isCurrent = f >= s.start && f < s.end;
          if (!isCurrent) return null;
          
          const rawLines = [s.slide.titulo || "", s.slide.corpo || ""].filter(Boolean);
          const accent: string[] = [];
          const lines = rawLines.map(line => {
            const matches = line.match(/==(.*?)==/g);
            if (matches) {
              matches.forEach(m => accent.push(m.replace(/==/g, "")));
            }
            return line.replace(/==/g, "");
          });
          const captionData = {
            n: `0${s.index}`,
            kicker: s.slide.rotulo || "Destaque",
            lines,
            accent,
            sub: "",
            inAt: s.start + 15,
            outAt: s.end - 15,
          };
          return <Caption key={s.index} f={f} c={captionData} />;
        })}

        {/* Capa / CTA overlays */}
        {isCapa && (
           <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: brand.cores.textoEscuro || "#000", fontFamily: brand.fontes.titulo, fontSize: 80, textAlign: "center", padding: 80 }}>
              <div style={{ fontWeight: 800 }}>{activeScene.slide.titulo}</div>
              {activeScene.slide.corpo && <div style={{ fontSize: 40, fontFamily: brand.fontes.corpo, opacity: 0.8, marginTop: 40 }}>{activeScene.slide.corpo}</div>}
              {activeScene.slide.botao && (
                <div style={{ marginTop: 80, padding: "20px 60px", background: brand.cores.acento, color: "#fff", borderRadius: 100, fontSize: 40 }}>
                  {activeScene.slide.botao}
                </div>
              )}
           </div>
        )}
      </AbsoluteFill>
    </PromoContext.Provider>
  );
};
