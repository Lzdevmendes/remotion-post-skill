import type { Brand } from "./brand/tipos";

export type Formato = "carrossel" | "unico" | "story" | "banner-linkedin" | "reels";
export type Variante = "4x5" | "1x1" | "capa" | "post";
export type Tema = "claro" | "tingido" | "escuro" | "acento";
export type Layout = "capa" | "texto" | "lista" | "print" | "celular" | "numero" | "codigo" | "cta";

export type TelaCelular = { rotulo: string; passos?: string[]; imagem?: string };
export type ItemCard = { titulo: string; sub?: string; emoji?: string; icone?: "seta" | "check" };
export type JanelaCodigo = { arquivo: string; rotulo?: string; linhas: string[] };

export type Slide = {
  layout: Layout;
  tema?: Tema;
  kicker?: string;
  emoji?: string;
  rotulo?: string;
  titulo?: string;
  corpo?: string;
  itens?: (string | ItemCard)[];
  imagem?: string;
  // "cobrir" (padrão) preenche a moldura 16:10 e corta as sobras; "inteiro" mostra a arte completa.
  encaixe?: "cobrir" | "inteiro";
  avatar?: string;
  selo?: { texto: string; tipo: "ar" | "pronto" | "obra" };
  fatos?: string[];
  botao?: string;
  telas?: TelaCelular[];
  numero?: { valor: string; legenda?: string };
  numeros?: { valor: string; rotulo: string }[];
  codigo?: JanelaCodigo[];
  dica?: { rotulo: string; texto: string; meta?: string };
  sticker?: { dica: string };
  proximo?: string;
  duracao?: number;
};

export type Post = {
  id: string;
  brand: string;
  formato: Formato;
  variante?: Variante;
  titulo: string;
  editoria?: string;
  serie?: { nome: string; numero: number };
  fundo?: "liso" | "orbs";
  musica?: { arquivo: string; inicio?: number; volume?: number };
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
export const TRANSICAO = 12;

export function quadrosCena(slide: Slide): number {
  return Math.max(TRANSICAO * 2, Math.round((slide.duracao ?? DURACAO_PADRAO_CENA) * FPS));
}

// As transições sobrepõem cenas vizinhas, então cada uma "come" TRANSICAO quadros do total.
export function duracaoReels(post: Post): number {
  const quadros = post.slides.reduce((soma, slide) => soma + quadrosCena(slide), 0);
  return Math.max(1, quadros - Math.max(0, post.slides.length - 1) * TRANSICAO);
}
