import { springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide as deslizar } from "@remotion/transitions/slide";
import { AbsoluteFill, Audio, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { assetSrc } from "../blocos";
import { useBrandFonts } from "../brand/fontes";
import type { Brand } from "../brand/tipos";
import { quadrosCena, TRANSICAO, type ArteProps, type Post, type Slide } from "../tipos-post";
import { Quadro } from "./Quadro";

// Mesmas curvas da landing: --ease-saida e a animação "grifar" (.72s com atraso de .55s).
const EASE_SAIDA = Easing.bezier(0.22, 0.7, 0.3, 1);
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export function Reels({ post, brand }: ArteProps) {
  useBrandFonts(brand);
  const timing = springTiming({ config: { damping: 200 }, durationInFrames: TRANSICAO });
  return (
    <AbsoluteFill style={{ background: brand.cores.fundoClaro }}>
      {post.musica && <Trilha post={post} />}
      <TransitionSeries>
        {post.slides.flatMap((slide, i) => {
          const cena = (
            <TransitionSeries.Sequence key={`cena-${i}`} durationInFrames={quadrosCena(slide)}>
              <Cena post={post} brand={brand} slide={slide} indice={i} />
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [cena];
          const transicao =
            i % 2 === 1 ? (
              <TransitionSeries.Transition key={`transicao-${i}`} presentation={deslizar({ direction: "from-right" })} timing={timing} />
            ) : (
              <TransitionSeries.Transition key={`transicao-${i}`} presentation={fade()} timing={timing} />
            );
          return [transicao, cena];
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
}

function Cena({ post, brand, slide, indice }: { post: Post; brand: Brand; slide: Slide; indice: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progresso = interpolate(frame, [0.55 * fps, 1.27 * fps], [0, 1], { ...CLAMP, easing: EASE_SAIDA });
  return <Quadro post={post} brand={brand} slide={slide} indice={indice} progresso={progresso} animado />;
}

function Trilha({ post }: { post: Post }) {
  const { fps, durationInFrames } = useVideoConfig();
  if (!post.musica) return null;
  const volume = post.musica.volume ?? 0.7;
  return (
    <Audio
      src={assetSrc(post.id, post.musica.arquivo)}
      startFrom={Math.round((post.musica.inicio ?? 0) * fps)}
      volume={(f) => interpolate(f, [0, 20, durationInFrames - 25, durationInFrames], [0, volume, volume, 0], CLAMP)}
    />
  );
}
