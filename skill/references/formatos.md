# Formatos, limites e estrutura

## Dimensões (definidas em `src/tipos-post.ts`)
| formato | variante | tamanho | saída |
|---|---|---|---|
| carrossel | — | 1080×1350 (4:5) | PNG por slide |
| unico | 4x5 (padrão) · 1x1 | 1080×1350 · 1080×1080 | PNG |
| story | — | 1080×1920 | PNG; margem de 250px em cima e embaixo (a UI do app cobre essa área) |
| banner-linkedin | capa (padrão) · post | 1584×396 · 1200×627 | PNG em scale 2; na capa a foto de perfil cobre o terço esquerdo, então o layout alinha tudo à direita (sem rótulo nem imagem) |
| reels | — | 1080×1920, 30fps | MP4 H.264 CRF 18 |

## Layouts (`slide.layout`)
| layout | quando usar | campos |
|---|---|---|
| capa | 1º slide / gancho | rotulo, titulo (grande), corpo curto |
| texto | uma ideia por slide | rotulo, titulo, corpo |
| lista | checklist, comparação | rotulo, titulo, itens (numerados) |
| print | case/prova visual | rotulo, titulo, imagem, corpo, fatos, selo |
| celular | passo a passo num app/sistema, mostrado em vez de descrito | rotulo, titulo, telas (1–2, cada uma com rotulo + 1–4 passos), corpo |
| cta | último slide | rotulo, titulo, corpo, botao (tema escuro por padrão) |

`tema`: `claro` (padrão), `tingido` (alternar ritmo no carrossel), `escuro` (padrão do cta; use no máximo 1–2 por carrossel).

## Retenção (todo post precisa de pelo menos 1)
Elementos que fazem a pessoa parar, voltar ou interagir. Escolha na entrevista e registre no roteiro.

| elemento | campo | quando usar |
|---|---|---|
| Selo de série | `post.serie: { nome, numero }` → chip "DICA #01" ao lado da marca | conteúdo recorrente (dicas, cases, bastidores). Cria expectativa pelo próximo. Mantenha o mesmo `nome` e incremente o `numero`. |
| Moldura de celular | layout `celular` com `telas` | qualquer passo a passo em tela: mostrar é mais rápido de entender do que listar. Até 2 celulares lado a lado (ex.: Android × iPhone). |
| Área de figurinha | `slide.sticker: { dica }` → área tracejada | **só story/reels**. Reserva o espaço da enquete/quiz/caixinha que o usuário adiciona no app, **cobrindo a área**. A `dica` diz qual figurinha e o texto (ex.: `Enquete: "Já instalou um app assim?"`). |
| Contador + "arraste →" | automático no carrossel | já existe; garanta que o slide 1 dê motivo pra arrastar. |

A figurinha é interação, não CTA: pode existir num post com CTA "nenhum".

## Acento (`==grifo==` e botão do cta)
- Cada `==trecho==` e cada botão de cta conta 1. Máximo = `brand.maxAcentosPorArte` por slide (o render recusa acima disso).
- Recomendado: **1 grifo por slide**, na palavra que carrega a tese.
- Selo de série, moldura de celular e área de figurinha **não** usam a cor de acento.

## Limites de texto (para caber sem cortar)
| layout | título | corpo |
|---|---|---|
| capa | ≤ 12 palavras | ≤ 15 palavras |
| texto | ≤ 10 palavras | ≤ 40 palavras |
| lista | ≤ 8 palavras | 3–5 itens, ≤ 10 palavras cada |
| print | ≤ 6 palavras | ≤ 20 palavras, ≤ 4 fatos |
| celular | ≤ 8 palavras | passos ≤ 4 palavras cada; corpo ≤ 12 palavras |
| cta | ≤ 8 palavras | ≤ 12 palavras, botão ≤ 4 palavras |
| banner capa | ≤ 8 palavras | ≤ 8 palavras |
| story | 1 ideia só | ≤ 25 palavras (sem contar passos do celular) |

## Arco
- **Carrossel**: capa (gancho) → contexto/problema → 2–6 slides de desenvolvimento (uma ideia cada) → prova (print/fato) → cta.
- **Post único / story**: gancho + prova (ou passo a passo) + interação ou CTA na mesma arte.
- **Reels**: 0–3s gancho (capa) → cenas de 3–4s → cta de 2–3s. Total 15–30s. Texto na tela precisa ser lido sem som.
- **Banner LinkedIn**: posicionamento em uma frase + prova curta (fatos) ou site.

## Legenda (`legenda.md`)
- 1ª linha = gancho (é o que aparece antes do "ver mais").
- Instagram: parágrafos curtos, CTA explícito, 3–5 hashtags específicas.
- LinkedIn: texto corrido, sem emoji excessivo, até 3 hashtags.
- Story: sem legenda; escreva o texto da figurinha (se houver) e um texto de apoio para Destaques/repost.
- Toda afirmação factual da legenda também precisa estar em `fontes.md`.
