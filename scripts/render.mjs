#!/usr/bin/env node
// Uso: npm run render -- "AAAA-MM-DD (tema)" [--slide=N]
// A pasta é procurada em POSTS_DIR (env) → postsDir de config.local.json → ~/Posts.
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const expandirHome = (p) => (p === "~" || p.startsWith("~/") ? path.join(os.homedir(), p.slice(1)) : p);

function pastaDosPosts() {
  if (process.env.POSTS_DIR) return expandirHome(process.env.POSTS_DIR);
  const config = path.join(RAIZ, "config.local.json");
  if (existsSync(config)) {
    const { postsDir } = JSON.parse(readFileSync(config, "utf8"));
    if (postsDir) return expandirHome(postsDir);
  }
  return path.join(os.homedir(), "Posts");
}

const POSTS_DIR = pastaDosPosts();
const args = process.argv.slice(2);
const pastaArg = args.find((a) => !a.startsWith("--"));
const slideArg = args.find((a) => a.startsWith("--slide="));

if (!pastaArg) {
  console.error(`Uso: npm run render -- "AAAA-MM-DD (tema)" [--slide=N]\nPasta dos posts: ${POSTS_DIR}`);
  process.exit(1);
}

const pastaPost = path.isAbsolute(pastaArg)
  ? pastaArg
  : existsSync(path.resolve(pastaArg))
    ? path.resolve(pastaArg)
    : path.join(POSTS_DIR, pastaArg);
const arquivoPost = path.join(pastaPost, "post.json");
if (!existsSync(arquivoPost)) throw new Error(`post.json não encontrado em ${pastaPost}`);

const post = JSON.parse(readFileSync(arquivoPost, "utf8"));
const caminhoBrand = path.join(RAIZ, "public/brands", post.brand, "brand.json");
if (!existsSync(caminhoBrand)) throw new Error(`Brand "${post.brand}" não encontrada em ${caminhoBrand}`);
const brand = JSON.parse(readFileSync(caminhoBrand, "utf8"));

const erros = [];
const formatoVertical = post.formato === "story" || post.formato === "reels";
if (post.musica) {
  if (post.formato !== "reels") erros.push("musica só existe no formato reels");
  else if (!existsSync(path.join(pastaPost, "assets", post.musica.arquivo))) erros.push(`musica assets/${post.musica.arquivo} não existe`);
}
post.slides.forEach((slide, i) => {
  if (slide.layout === "celular") {
    const telas = slide.telas ?? [];
    if (post.formato === "banner-linkedin") erros.push(`slide ${i + 1}: layout celular não existe no banner-linkedin`);
    if (telas.length < 1 || telas.length > 2) erros.push(`slide ${i + 1}: layout celular precisa de 1 ou 2 telas`);
    telas.forEach((tela, j) => {
      if (tela.imagem) {
        if (!/^https?:\/\//.test(tela.imagem) && !existsSync(path.join(pastaPost, "assets", tela.imagem))) {
          erros.push(`slide ${i + 1}, tela ${j + 1}: imagem assets/${tela.imagem} não existe`);
        }
      } else if (!tela.passos?.length || tela.passos.length > 4) {
        erros.push(`slide ${i + 1}, tela ${j + 1}: de 1 a 4 passos (ou uma imagem)`);
      }
    });
  }
  if (slide.sticker && !formatoVertical) erros.push(`slide ${i + 1}: sticker só existe em story/reels (figurinha do Instagram)`);
  const itensTexto = (slide.itens ?? []).flatMap((item) => (typeof item === "string" ? [item] : [item.titulo, item.sub]));
  const textos = [slide.titulo, slide.corpo, slide.dica?.texto, ...itensTexto].filter(Boolean).join(" ");
  const marcas = textos.match(/==[^=]+==|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~/g)?.length ?? 0;
  const acentos = marcas + (slide.layout === "cta" && slide.botao ? 1 : 0) + (slide.tema === "acento" ? 1 : 0);
  if (acentos > brand.maxAcentosPorArte) erros.push(`slide ${i + 1}: ${acentos} acentos (máx. ${brand.maxAcentosPorArte})`);
  if (slide.layout === "numero" && !slide.numero?.valor) erros.push(`slide ${i + 1}: layout numero precisa de "numero.valor"`);
  if (slide.layout === "codigo") {
    const janelas = slide.codigo ?? [];
    if (janelas.length < 1 || janelas.length > 2) erros.push(`slide ${i + 1}: layout codigo precisa de 1 ou 2 janelas`);
    janelas.forEach((janela, k) => {
      if (!janela.linhas?.length || janela.linhas.length > 12) erros.push(`slide ${i + 1}, janela ${k + 1}: de 1 a 12 linhas`);
    });
  }
  if ((slide.numeros?.length ?? 0) > 4) erros.push(`slide ${i + 1}: no máximo 4 números`);
  if ((slide.itens?.length ?? 0) > 6) erros.push(`slide ${i + 1}: no máximo 6 itens`);
  for (const [campo, arquivo] of [["imagem", slide.imagem], ["avatar", slide.avatar]]) {
    if (arquivo && !/^https?:\/\//.test(arquivo) && !existsSync(path.join(pastaPost, "assets", arquivo))) {
      erros.push(`slide ${i + 1}: ${campo} assets/${arquivo} não existe`);
    }
  }
});
if (erros.length) {
  console.error("post.json inválido:\n- " + erros.join("\n- "));
  process.exit(1);
}

// staticFile não lida bem com espaço/parênteses do nome da pasta: os assets vão para um id seguro.
const idSeguro = String(post.id).replace(/[^a-z0-9-]/gi, "-");
const assetsOrigem = path.join(pastaPost, "assets");
const assetsDestino = path.join(RAIZ, "public/_assets", idSeguro);
rmSync(assetsDestino, { recursive: true, force: true });
if (existsSync(assetsOrigem)) cpSync(assetsOrigem, assetsDestino, { recursive: true });
const postRender = { ...post, id: idSeguro };

console.log(`Empacotando (${post.formato}, ${post.slides.length} slides)...`);
const serveUrl = await bundle({ entryPoint: path.join(RAIZ, "src/index.ts"), publicDir: path.join(RAIZ, "public") });

if (post.formato === "reels") {
  const inputProps = { post: postRender, brand, indice: 0 };
  const composition = await selectComposition({ serveUrl, id: "Reels", inputProps });
  const arquivo = path.join(pastaPost, "reels.mp4");
  await renderMedia({ serveUrl, composition, inputProps, codec: "h264", crf: 18, outputLocation: arquivo });
  console.log(`✓ ${arquivo} (${composition.width}×${composition.height}, ${composition.durationInFrames} frames)`);
} else {
  const scale = post.formato === "banner-linkedin" ? 2 : 1;
  const indices = slideArg ? [Number(slideArg.split("=")[1]) - 1] : post.slides.map((_, i) => i);
  for (const indice of indices) {
    const inputProps = { post: postRender, brand, indice };
    const composition = await selectComposition({ serveUrl, id: "Arte", inputProps });
    const arquivo = path.join(pastaPost, `slide-${String(indice + 1).padStart(2, "0")}.png`);
    await renderStill({ serveUrl, composition, inputProps, output: arquivo, imageFormat: "png", scale });
    console.log(`✓ ${arquivo} (${composition.width * scale}×${composition.height * scale})`);
  }
}
