---
name: remotion-post
description: Cria posts para redes sociais (carrossel, post único, story, banner LinkedIn, reels) em código com Remotion, usando o design do projeto atual (fontes, cores, tipografia). Lê o design, entrevista o usuário para alinhar a tese, pesquisa o tema, apresenta o roteiro em um artifact, prepara assets visuais (IA, cortes, prints) e só depois renderiza PNG/MP4.
---

# Criador de Posts com Remotion

## Caminhos (resolva antes de tudo)
- **Estúdio** (este repo): `ESTUDIO="$(cd "$(dirname "$(readlink -f "./skill/SKILL.md")")/.." && pwd)"` (ajuste o caminho de acordo com seu diretório de trabalho atual).
- **Pasta dos posts**, nesta ordem: env `POSTS_DIR` → campo `postsDir` de `"$ESTUDIO/config.local.json"` → `~/Posts`.
  Se `config.local.json` não existir, pergunte ao usuário onde salvar e crie o arquivo a partir de `config.example.json`.
- Caminhos podem ter espaço, apóstrofo ou parênteses: **sempre entre aspas duplas** no shell ao usar `run_command`.

```
$ESTUDIO/
  public/brands/<brand>/brand.json + fonts/   design extraído de cada projeto
  src/blocos, src/formatos                     componentes (Quadro = layout de todos os formatos)
  scripts/render.mjs                           npm run render -- "AAAA-MM-DD (tema)" [--slide=N]
  exemplos/                                    um post.json por formato + carrossel-dev com todos os blocos
$POSTS_DIR/
  AAAA-MM-DD (tema)/                           post.json, roteiro.md, legenda.md, fontes.md, assets/, slide-NN.png | reels.mp4
```

Siga as 7 fases **em ordem**. Não renderize nada antes do roteiro aprovado e dos assets estarem devidamente preparados.

## Fase 1 — Ler o design do projeto atual
1. O projeto é o cwd ou o workspace atual. `brand` = nome da pasta do repo em kebab-case.
2. Siga `references/ler-design.md` para extrair cores, fontes, raio e tracking. Utilize ferramentas de busca em arquivos.
3. Se `public/brands/<brand>/brand.json` já existe no estúdio: compare com o projeto hoje e mostre só as diferenças; atualize só se o usuário confirmar.
4. Mostre um resumo curto (paleta com hex + fontes + regra do acento) e confirme antes de seguir.
5. Fora de um projeto com design (home, pasta vazia): pergunte qual brand existente usar rodando `ls "$ESTUDIO/public/brands"`.

## Fase 2 — Entrevista de Alinhamento
Siga `references/entrevista.md`. Use a ferramenta `ask_question` em rodadas (máx. 4 perguntas de múltipla escolha com opções concretas, sugerindo a melhor primeiro). Como alternativa ou se precisar aprofundar, você pode recomendar ao usuário o uso do comando `/grill-me`. Depois das rodadas fixas, **aperte a tese** até existir uma frase única que o leitor deve lembrar. Não siga com resposta vaga.

## Fase 3 — Pesquisa
- Post sobre projeto do usuário: leia código/README/conteúdo do repo com `view_file` ou `run_command` (grep); esses fatos são a fonte primária.
- Post sobre tema: Use as ferramentas `search_web` e `read_url_content` para buscar fontes primárias (documentação oficial, pesquisa original, changelog), preferindo os últimos 12 meses.
- Registre em `fontes.md` (afirmação → URL/arquivo). **Nenhum número ou afirmação factual entra sem linha em `fontes.md`** — vale também para `numeros` e `numero`. Na dúvida, corte.
- Nomes de botões/menus citados na arte: confirme no idioma do post; se só achar em outro idioma, registre isso em `fontes.md`.

## Fase 4 — Roteiro em Artifact
1. Crie um **Artifact** Markdown para apresentar o roteiro detalhado de forma visual ao usuário.
2. Roteiro conforme `references/roteiro-template.md`: slide a slide com layout, tema, texto **exato** (com as marcas `==grifo==`, `**destaque**`, `__sublinhado__`, `~~riscado~~`), blocos, visual, próximo, figurinha, contagem de acentos; legenda + hashtags; no reels, tempo de cada cena.
3. Escolha uma **estrutura** de `references/formatos.md` (mito → verdade → prova, trilha, antes & depois, problema → solução, apresentação) ou justifique a livre.
4. **Todo post tem pelo menos 1 elemento de retenção** (chip de editoria/série, prévia do próximo, spoiler, `celular`, figurinha, final invertido). Passo a passo em tela vira `celular`; código vira `codigo`; dado forte vira `numero`/`numeros`.
5. Respeite os limites de `references/formatos.md` (inclusive **no máximo 2 blocos extras por slide**).
6. Pare de usar ferramentas após gerar o Artifact e **peça aprovação explícita** do usuário; ajuste e reapresente se pedirem.

## Fase 5 — Preparação de Assets
Antes de montar o JSON e renderizar, os arquivos físicos precisam estar prontos.
1. Crie o diretório base: `"$POSTS_DIR/AAAA-MM-DD (tema)/assets/"`.
2. Siga `references/preparacao-assets.md` para preparar os materiais visuais.
3. Use a ferramenta `generate_image` nativa para fundos e ilustrações (se solicitados no roteiro).
4. Use `ffmpeg` e `imagemagick` para cortar vídeos ou redimensionar imagens (ex: prints) e ajustá-los às dimensões necessárias (ex: proporção 9:16 para celular).
5. Certifique-se de que avatares/stickers tenham canal alpha (fundo transparente). Você pode usar `view_file` nas imagens ou rodar `identify` (imagemagick) para conferir.
6. Apenas siga para a próxima fase quando tudo listado em "Assets necessários" no roteiro existir na pasta `assets/`.

## Fase 6 — Produção e JSON
1. Salve em `"$POSTS_DIR/AAAA-MM-DD (tema)/"` os arquivos: `roteiro.md` (o aprovado), `fontes.md`, `legenda.md`.
2. Crie o `post.json` referenciando os arquivos preparados na Fase 5.
   ```json
   {
     "id": "AAAA-MM-DD-tema-kebab", "brand": "<brand>", "formato": "carrossel|unico|story|banner-linkedin|reels",
     "variante": "4x5|1x1 (unico) · capa|post (banner-linkedin)", "titulo": "...",
     "editoria": "Terça · Mito", "serie": { "nome": "Mito", "numero": 1 },
     "fundo": "liso|orbs", "musica": { "arquivo": "trilha.mp3", "inicio": 40, "volume": 0.7 },
     "slides": [{
       "layout": "capa|texto|lista|print|celular|numero|codigo|cta", "tema": "claro|tingido|escuro|acento",
       "emoji": "🏖️", "kicker": "o que ninguém te conta", "rotulo": "...",
       "titulo": "Texto com ==grifo==, **destaque**, __sublinhado__ ou ~~riscado~~", "corpo": "...",
       "itens": ["linha simples", { "titulo": "card", "sub": "subtítulo", "emoji": "⏱️", "icone": "check" }],
       "imagem": "print.png", "encaixe": "cobrir|inteiro", "avatar": "eu-recortado.png", "selo": { "texto": "...", "tipo": "ar|pronto|obra" },
       "fatos": ["..."], "botao": "...",
       "telas": [{ "rotulo": "Android", "passos": ["Chrome", "Mais", "Instalar"] }, { "rotulo": "Painel", "imagem": "print-painel.png" }],
       "numero": { "valor": "01", "legenda": "de 06 passos" },
       "numeros": [{ "valor": "4", "rotulo": "cidades" }],
       "codigo": [{ "rotulo": "antes", "arquivo": "ruim.js", "linhas": ["if (x === 1) {", "}"] }],
       "dica": { "rotulo": "dica", "meta": "tempo: 1h", "texto": "..." },
       "sticker": { "dica": "Enquete: \"Já instalou um app assim?\"" },
       "proximo": "choveu do nada",
       "duracao": 3
     }]
   }
   ```
3. Renderize: `cd "$ESTUDIO" && npm run render -- "AAAA-MM-DD (tema)"`. O script valida acentos, assets, telas, código, números e figurinha antes.

## Fase 7 — Verificação (obrigatória antes de entregar)
- Use a ferramenta `view_file` em **cada** arquivo `.png` gerado para analisar o visual: verifique se há texto cortado/sobreposto, fonte de fallback (Arial/Georgia no lugar da fonte da brand), emoji virando quadrado (falta fonte de emoji no sistema), marcas no lugar certo, contraste, margem de segurança do story, conteúdo invadindo o rodapé, avatar cobrindo texto, código estourando a janela. (Antigravity permite análise visual através do `view_file`).
- Dimensões: use `run_command` com `file "<pasta>"/*.png` · reels: `ffprobe -v error -show_entries stream=width,height,duration -of csv=p=0 "<pasta>/reels.mp4"`.
- Reels: extraia 3 frames para um diretório temporário (`ffmpeg -ss <t> -i "<pasta>/reels.mp4" -frames:v 1 <tmp>/f.png`) e use `view_file` para analisar visualmente.
- Problema: corrija o `post.json` (ou o componente) e renderize só o slide afetado (`--slide=N`).
- Entregue: caminho da pasta, lista das artes, conteúdo de `legenda.md` (com o texto da figurinha, se houver) e o que foi ajustado na verificação.
