import { Composition, Still, type CalculateMetadataFunction } from "remotion";
import { exemploCarrossel, exemploReels } from "./exemplo";
import { Arte } from "./formatos/Arte";
import { Reels } from "./formatos/Reels";
import { dimensoes, duracaoReels, FPS, type ArteProps } from "./tipos-post";

const metaArte: CalculateMetadataFunction<ArteProps> = ({ props }) => dimensoes(props.post);

const metaReels: CalculateMetadataFunction<ArteProps> = ({ props }) => ({
  ...dimensoes(props.post),
  durationInFrames: duracaoReels(props.post),
});

export function RemotionRoot() {
  return (
    <>
      <Still id="Arte" component={Arte} width={1080} height={1350} defaultProps={exemploCarrossel} calculateMetadata={metaArte} />
      <Composition
        id="Reels"
        component={Reels}
        fps={FPS}
        width={1080}
        height={1920}
        durationInFrames={duracaoReels(exemploReels.post)}
        defaultProps={exemploReels}
        calculateMetadata={metaReels}
      />
    </>
  );
}
