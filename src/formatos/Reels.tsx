import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import { paleta } from "../blocos";
import { useBrandFonts } from "../brand/fontes";
import type { Brand } from "../brand/tipos";
import { DURACAO_PADRAO_CENA, type ArteProps, type Post, type Slide } from "../tipos-post";
import { Quadro } from "./Quadro";

// Mesmas curvas da landing: --ease-saida e a animação "grifar" (.72s com atraso de .55s).
const EASE_SAIDA = Easing.bezier(0.22, 0.7, 0.3, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function Reels({ post, brand }: ArteProps) {
  useBrandFonts(brand);
  const { fps } = useVideoConfig();
  let inicio = 0;
  return (
    <AbsoluteFill style={{ background: brand.cores.fundoClaro }}>
      {post.slides.map((slide, i) => {
        const duracao = Math.round((slide.duracao ?? DURACAO_PADRAO_CENA) * fps);
        const from = inicio;
        inicio += duracao;
        return (
          <Sequence key={i} from={from} durationInFrames={duracao}>
            <Cena post={post} brand={brand} slide={slide} indice={i} duracao={duracao} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}

function Cena({ post, brand, slide, indice, duracao }: { post: Post; brand: Brand; slide: Slide; indice: number; duracao: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = interpolate(frame, [0, 0.5 * fps], [0, 1], { ...CLAMP, easing: EASE_SAIDA });
  const progresso = interpolate(frame, [0.55 * fps, 1.27 * fps], [0, 1], { ...CLAMP, easing: EASE_SAIDA });
  const saida = indice === post.slides.length - 1 ? 1 : interpolate(frame, [duracao - 0.3 * fps, duracao], [1, 0], CLAMP);
  const p = paleta(brand, slide.tema ?? (slide.layout === "cta" ? "escuro" : "claro"));
  return (
    <AbsoluteFill style={{ background: p.fundo }}>
      <AbsoluteFill style={{ opacity: saida }}>
        <Quadro post={post} brand={brand} slide={slide} indice={indice} entrada={entrada} progresso={progresso} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
