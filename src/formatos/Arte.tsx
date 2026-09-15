import { useBrandFonts } from "../brand/fontes";
import type { ArteProps } from "../tipos-post";
import { Quadro } from "./Quadro";

export function Arte({ post, brand, indice }: ArteProps) {
  useBrandFonts(brand);
  const slide = post.slides[indice];
  if (!slide) throw new Error(`Slide ${indice} não existe em ${post.id} (${post.slides.length} slides)`);
  return <Quadro post={post} brand={brand} slide={slide} indice={indice} />;
}
