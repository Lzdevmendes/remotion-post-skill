import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import type { Brand } from "./tipos";

// Nova fonte do Google usada por alguma brand: adicionar a entrada aqui, só com os pesos usados.
const GOOGLE_FONTS: Record<string, () => Promise<{ waitUntilDone: () => Promise<void> }>> = {
  JetBrainsMono: async () =>
    (await import("@remotion/google-fonts/JetBrainsMono")).loadFont("normal", { weights: ["400", "500"], subsets: ["latin"] }),
  SpaceGrotesk: async () =>
    (await import("@remotion/google-fonts/SpaceGrotesk")).loadFont("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin", "latin-ext"] }),
  Newsreader: async () =>
    (await import("@remotion/google-fonts/Newsreader")).loadFont("normal", { weights: ["400", "600"], subsets: ["latin", "latin-ext"] }),
};

const carregadas = new Map<string, Promise<void>>();

function carregarBrand(brand: Brand): Promise<void> {
  const existente = carregadas.get(brand.id);
  if (existente) return existente;

  const locais = brand.arquivosFonte.map((f) =>
    loadFont({
      family: f.family,
      url: staticFile(`brands/${brand.id}/fonts/${f.arquivo}`),
      weight: f.weight,
      style: f.style,
      unicodeRange: f.unicodeRange,
    }),
  );
  const google = (brand.googleFonts ?? []).map(async (nome) => {
    const importar = GOOGLE_FONTS[nome];
    if (!importar) throw new Error(`Google Font "${nome}" não registrada em src/brand/fontes.ts`);
    const fonte = await importar();
    await fonte.waitUntilDone();
  });

  const promessa = Promise.all([...locais, ...google]).then(() => undefined);
  carregadas.set(brand.id, promessa);
  return promessa;
}

export function useBrandFonts(brand: Brand) {
  const [handle] = useState(() => delayRender(`fontes da brand ${brand.id}`));
  useEffect(() => {
    carregarBrand(brand)
      .then(() => continueRender(handle))
      .catch((erro) => cancelRender(erro));
  }, [brand, handle]);
}
