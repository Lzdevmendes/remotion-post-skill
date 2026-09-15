import brandLz from "../public/brands/lz-landing/brand.json";
import type { Brand } from "./brand/tipos";
import type { ArteProps } from "./tipos-post";

const brand = brandLz as Brand;

export const exemploCarrossel: ArteProps = {
  brand,
  indice: 0,
  post: {
    id: "exemplo",
    brand: "lz-landing",
    formato: "carrossel",
    titulo: "Exemplo de carrossel",
    slides: [
      {
        layout: "capa",
        rotulo: "Trabalho",
        titulo: "Software que ==entra em produção==.",
        corpo: "Web, mobile e as integrações no meio.",
      },
      {
        layout: "print",
        rotulo: "Case",
        titulo: "Litoral na Palma",
        selo: { texto: "MVP fechado", tipo: "pronto" },
        corpo: "App do litoral norte: praias, balsas, trânsito e alertas por geofencing.",
        fatos: ["4 municípios", "33 praias", "React Native", "Supabase"],
      },
      {
        layout: "cta",
        rotulo: "Contato",
        titulo: "Um projeto por vez. ==Resposta em até 24h.==",
        botao: "Fale comigo →",
      },
    ],
  },
};

export const exemploReels: ArteProps = {
  ...exemploCarrossel,
  post: { ...exemploCarrossel.post, id: "exemplo-reels", formato: "reels", titulo: "Exemplo de reels" },
};
