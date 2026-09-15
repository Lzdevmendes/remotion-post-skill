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
post.slides.forEach((slide, i) => {
  const textos = [slide.titulo, slide.corpo, ...(slide.itens ?? [])].filter(Boolean).join(" ");
  const acentos = (textos.match(/==[^=]+==/g)?.length ?? 0) + (slide.layout === "cta" && slide.botao ? 1 : 0);
  if (acentos > brand.maxAcentosPorArte) erros.push(`slide ${i + 1}: ${acentos} acentos (máx. ${brand.maxAcentosPorArte})`);
  if (slide.imagem && !/^https?:\/\//.test(slide.imagem) && !existsSync(path.join(pastaPost, "assets", slide.imagem))) {
    erros.push(`slide ${i + 1}: imagem assets/${slide.imagem} não existe`);
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
