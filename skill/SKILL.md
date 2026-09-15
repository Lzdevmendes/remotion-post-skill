---
name: post
description: Cria posts para redes sociais (carrossel, post único, story, banner LinkedIn, reels) em código com Remotion, usando o design do projeto atual (fontes, cores, tipografia). Lê o design, entrevista estilo grill-me, pesquisa o tema, apresenta o roteiro em plan mode e só depois renderiza PNG/MP4.
disable-model-invocation: true
---

# /post

## Caminhos (resolva antes de tudo)
- **Estúdio** (este repo): `ESTUDIO="$(cd "$(dirname "$(readlink -f ~/.claude/skills/post/SKILL.md)")/.." && pwd)"`
- **Pasta dos posts**, nesta ordem: env `POSTS_DIR` → campo `postsDir` de `"$ESTUDIO/config.local.json"` → `~/Posts`.
  Se `config.local.json` não existir, pergunte ao usuário onde salvar e crie o arquivo a partir de `config.example.json`.
- Caminhos podem ter espaço, apóstrofo ou parênteses: **sempre entre aspas duplas** no shell.

```
$ESTUDIO/
  public/brands/<brand>/brand.json + fonts/   design extraído de cada projeto
  src/blocos, src/formatos                     componentes (Quadro = layout de todos os formatos)
  scripts/render.mjs                           npm run render -- "AAAA-MM-DD (tema)" [--slide=N]
  exemplos/                                    um post.json por formato
$POSTS_DIR/
  AAAA-MM-DD (tema)/                           post.json, roteiro.md, legenda.md, fontes.md, assets/, slide-NN.png | reels.mp4
```

Siga as 6 fases **em ordem**. Não renderize nada antes do roteiro aprovado.

## Fase 1 — Ler o design do projeto atual
1. O projeto é o cwd. `brand` = nome da pasta do repo em kebab-case.
2. Siga `references/ler-design.md` para extrair cores, fontes, raio e tracking.
3. Se `public/brands/<brand>/brand.json` já existe no estúdio: compare com o projeto hoje e mostre só as diferenças; atualize só se o usuário confirmar.
4. Mostre um resumo curto (paleta com hex + fontes + regra do acento) e confirme antes de seguir.
5. Fora de um projeto com design (home, pasta vazia): pergunte qual brand existente usar (`ls "$ESTUDIO/public/brands"`).

## Fase 2 — Entrevista (estilo grill-me)
Siga `references/entrevista.md`. `AskUserQuestion` em rodadas (máx. 4 perguntas), opções concretas com a recomendada primeiro. Depois das rodadas fixas, **aperte a tese** até existir uma frase única que o leitor deve lembrar. Não siga com resposta vaga.

## Fase 3 — Pesquisa
- Post sobre projeto do usuário: leia código/README/conteúdo do repo; esses fatos são a fonte primária.
- Post sobre tema: `WebSearch`/`WebFetch` com fontes primárias (documentação oficial, pesquisa original, changelog), preferindo os últimos 12 meses.
- Registre em `fontes.md` (afirmação → URL/arquivo). **Nenhum número ou afirmação factual entra sem linha em `fontes.md`.** Na dúvida, corte.

## Fase 4 — Roteiro em plan mode
1. `EnterPlanMode`.
2. Roteiro conforme `references/roteiro-template.md`: slide a slide com layout, tema, texto **exato** (com `==grifo==`), visual, contagem de acentos; legenda + hashtags; no reels, tempo de cada cena.
3. Respeite os limites de `references/formatos.md`.
4. `ExitPlanMode` para aprovação; ajuste e reapresente se pedirem.

## Fase 5 — Produção
1. Crie `"$POSTS_DIR/AAAA-MM-DD (tema)/"` — data de hoje; entre parênteses o nome do projeto ou o tema curto (ex.: `2026-09-14 (Litoral na Palma)`). Dentro: `roteiro.md` (o aprovado), `fontes.md`, `legenda.md`, `post.json`.
2. Prints/vídeos vão em `assets/` e são referenciados por nome em `slide.imagem`.
3. `post.json` (tipos em `src/tipos-post.ts`; exemplos em `exemplos/`):
   ```json
   {
     "id": "AAAA-MM-DD-tema-kebab", "brand": "<brand>", "formato": "carrossel|unico|story|banner-linkedin|reels",
     "variante": "4x5|1x1 (unico) · capa|post (banner-linkedin)", "titulo": "...",
     "slides": [{
       "layout": "capa|texto|lista|print|cta", "tema": "claro|tingido|escuro",
       "rotulo": "...", "titulo": "Texto com ==grifo==", "corpo": "...", "itens": ["..."],
       "imagem": "arquivo-em-assets.png", "selo": { "texto": "...", "tipo": "ar|pronto|obra" },
       "fatos": ["..."], "botao": "...", "duracao": 3
     }]
   }
   ```
4. Renderize: `cd "$ESTUDIO" && npm run render -- "AAAA-MM-DD (tema)"`. O script valida acentos e imagens antes.
5. Layout novo realmente necessário: implemente em `src/formatos/Quadro.tsx` reaproveitando `src/blocos`, carregue a skill `remotion-best-practices` se disponível, e rode `npm run typecheck`.

## Fase 6 — Verificação (obrigatória antes de entregar)
- `Read` em **cada** PNG: texto cortado/sobreposto, fonte de fallback (Arial/Georgia no lugar da fonte da brand), grifo no lugar certo, contraste, margem de segurança do story.
- Dimensões: `file "<pasta>"/*.png` · reels: `ffprobe -v error -show_entries stream=width,height,duration -of csv=p=0 "<pasta>/reels.mp4"`.
- Reels: extraia 3 frames para um diretório temporário (`ffmpeg -ss <t> -i "<pasta>/reels.mp4" -frames:v 1 <tmp>/f.png`) e faça `Read`.
- Problema: corrija o `post.json` (ou o componente) e renderize só o slide afetado (`--slide=N`).
- Entregue: caminho da pasta, lista das artes, conteúdo de `legenda.md` e o que foi ajustado na verificação.
