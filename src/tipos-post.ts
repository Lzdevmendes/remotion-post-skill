import type { Brand } from "./brand/tipos";

export type Formato = "carrossel" | "unico" | "story" | "banner-linkedin" | "reels";
export type Variante = "4x5" | "1x1" | "capa" | "post";
export type Tema = "claro" | "tingido" | "escuro";
export type Layout = "capa" | "texto" | "lista" | "print" | "cta";

export type Slide = {
  layout: Layout;
  tema?: Tema;
  rotulo?: string;
  titulo?: string;
  corpo?: string;
  itens?: string[];
  imagem?: string;
  selo?: { texto: string; tipo: "ar" | "pronto" | "obra" };
  fatos?: string[];
  botao?: string;
  duracao?: number;
};

export type Post = {
  id: string;
  brand: string;
  formato: Formato;
  variante?: Variante;
  titulo: string;
  slides: Slide[];
};

export type ArteProps = { post: Post; brand: Brand; indice: number };

export function dimensoes(post: Post): { width: number; height: number } {
  switch (post.formato) {
    case "carrossel":
      return { width: 1080, height: 1350 };
    case "unico":
      return post.variante === "1x1" ? { width: 1080, height: 1080 } : { width: 1080, height: 1350 };
    case "story":
    case "reels":
      return { width: 1080, height: 1920 };
    case "banner-linkedin":
      return post.variante === "post" ? { width: 1200, height: 627 } : { width: 1584, height: 396 };
  }
}

export const FPS = 30;
export const DURACAO_PADRAO_CENA = 3;

export function duracaoReels(post: Post): number {
  const segundos = post.slides.reduce((soma, s) => soma + (s.duracao ?? DURACAO_PADRAO_CENA), 0);
  return Math.max(1, Math.round(segundos * FPS));
}
