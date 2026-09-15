# Formatos, blocos e estrutura

## Dimensões (definidas em `src/tipos-post.ts`)
| formato | variante | tamanho | saída |
|---|---|---|---|
| carrossel | — | 1080×1350 (4:5) | PNG por slide |
| unico | 4x5 (padrão) · 1x1 | 1080×1350 · 1080×1080 | PNG |
| story | — | 1080×1920 | PNG; margem de 250px em cima e embaixo (a UI do app cobre essa área) |
| banner-linkedin | capa (padrão) · post | 1584×396 · 1200×627 | PNG em scale 2; na capa a foto de perfil cobre o terço esquerdo, então o layout alinha tudo à direita (sem rótulo nem imagem) |
| reels | — | 1080×1920, 30fps | MP4 H.264 CRF 18 |

## Layouts (`slide.layout`)
| layout | quando usar | campos principais |
|---|---|---|
| capa | 1º slide / gancho | rotulo, titulo (grande), corpo curto |
| texto | uma ideia por slide | rotulo, titulo, corpo |
| lista | checklist, comparação, "o que rola aqui" | titulo, itens (texto simples = linhas; objetos = cards) |
| print | case/prova visual | titulo, imagem, `encaixe`, corpo, fatos, selo |
| celular | passo a passo num app/sistema, mostrado em vez de descrito | titulo, telas (1–2, cada uma com rotulo + 1–4 passos), corpo |
| numero | passo N de uma trilha, dado que choca ("0 vezes"), capítulo | numero `{ valor, legenda }`, titulo, corpo, itens |
| codigo | trecho de código ou antes & depois | titulo, codigo (1–2 janelas `{ arquivo, rotulo?, linhas }`), corpo |
| cta | último slide | titulo, corpo, botao (tema escuro por padrão; `tema: "acento"` para inverter) |

## Blocos que entram em qualquer layout vertical
Renderizados na ordem: `emoji` → `kicker` → conteúdo do layout → `numeros` → `dica` → `sticker`.

| campo | o que é | uso |
|---|---|---|
| `emoji` | emoji grande abrindo o slide | 1 por slide, ligado ao tema do slide (🏖️ praia, 💧 água). Não em todos os slides do carrossel se já houver outro destaque. |
| `kicker` | linha em fonte mono no estilo comentário: `// o que ninguém te conta` | contexto/curiosidade acima do título; substitui o `rotulo` quando o tom é mais "dev"/conversa. |
| `itens` (objetos) | cards `{ titulo, sub?, emoji?, icone?: "seta" \| "check" }` com barra lateral | listas com subtítulo, agenda, benefícios, passos. Emoji vira ícone em quadradinho. |
| `numeros` | grade de 1–4 cards `{ valor, rotulo }` — o 1º em cor de destaque | provas numéricas. **Cada número precisa estar em `fontes.md`.** No reels, os números contam de 0 até o valor. |
| `dica` | caixa `{ rotulo, texto, meta? }` com barra lateral | "DICA · tempo: 1h", "SPOILER DO PRÓXIMO SLIDE", "PROVA REAL". |
| `avatar` | imagem recortada (PNG transparente em `assets/`) no canto inferior direito | foto/mascote do autor; deixe espaço à direita no layout. |
| `sticker` | área tracejada para figurinha | **só story/reels**. |

## Marcas de texto (título, corpo, itens, dica)
| escrita | efeito | quando |
|---|---|---|
| `==texto==` | grifo na cor de acento (no tema acento vira bloco escuro) | a palavra da tese |
| `**texto**` | texto na cor de destaque do tema | termo-chave, sem pesar o slide |
| `__texto__` | sublinhado desenhado à mão (anima no reels) | palavra curta, sem quebra de linha |
| `~~texto~~` | riscado na cor `alerta` da brand (anima no reels) | derrubar mito/crença ("~~bom em matemática~~") |

Cada marca conta 1 acento. Máximo = `brand.maxAcentosPorArte` por slide (o render recusa acima disso).

## Temas (`slide.tema`)
- `claro` (padrão) · `tingido` (alternar ritmo no carrossel) · `escuro` (padrão do cta; máx. 1–2 por carrossel).
- `acento`: fundo inteiro na cor de acento, cards escuros por cima. **Só no último slide** (final/CTA). Conta 1 acento.

## Retenção (todo post precisa de pelo menos 1)
| elemento | campo | quando usar |
|---|---|---|
| Chip de editoria/série | `post.editoria` ("Terça · Mito") e/ou `post.serie: { nome, numero }` → "● TERÇA · MITO #01" | conteúdo recorrente. Editoria dá o ritmo da semana; série cria expectativa pelo próximo número. |
| Barra de progresso | automática no carrossel ("01 / 05" + traços) | sempre; garanta que o slide 1 dê motivo pra arrastar. |
| CTA do rodapé | automático: "arraste →" no 1º, "próximo →" no meio, handle no último | padrão. |
| Prévia do próximo slide | `slide.proximo: "choveu do nada"` → "PRÓXIMO: CHOVEU DO NADA →" | carrossel narrativo (problema → solução); ≤ 5 palavras. |
| Spoiler | `dica` com `rotulo: "spoiler do próximo slide"` | gancho de curiosidade no slide 1. |
| Moldura de celular | layout `celular` | passo a passo em tela. |
| Área de figurinha | `slide.sticker: { dica }` | story/reels: enquete/quiz/caixinha adicionada no app **cobrindo a área**. |
| Final invertido | `tema: "acento"` no último slide + CTA social | "marca aquele amigo que…", "salva pra quando…", "manda pro grupo do trampo". |

A figurinha é interação, não CTA: pode existir num post com CTA "nenhum".

## Limites de texto (para caber sem cortar)
| layout / bloco | título | resto |
|---|---|---|
| capa | ≤ 12 palavras | corpo ≤ 15 palavras |
| texto | ≤ 10 palavras | corpo ≤ 40 palavras |
| lista | ≤ 8 palavras | 3–6 itens; título do card ≤ 6 palavras, sub ≤ 8 |
| print | ≤ 6 palavras | corpo ≤ 20 palavras, ≤ 4 fatos |
| celular | ≤ 8 palavras | passos ≤ 4 palavras cada; corpo ≤ 12 palavras |
| numero | ≤ 6 palavras | valor ≤ 3 caracteres; legenda ≤ 4 palavras; ≤ 3 itens |
| codigo | ≤ 8 palavras | ≤ 12 linhas; ≤ 30 caracteres por linha com 2 janelas, ≤ 45 com 1 |
| cta | ≤ 8 palavras | corpo ≤ 12 palavras, botão ≤ 4 palavras |
| dica | — | texto ≤ 20 palavras |
| banner capa | ≤ 8 palavras | ≤ 8 palavras |
| story | 1 ideia só | ≤ 25 palavras (sem contar passos, código e números) |

Não empilhe tudo: no máximo **2 blocos extras** (`numeros`, `dica`, `sticker`, `emoji`) por slide, e confira na verificação se nada invade o rodapé.

## Estruturas de carrossel que funcionam
- **Mito → verdade → prova → final**: capa com `~~riscado~~` + spoiler · `codigo` ou `texto` com a verdade · `numero`/`numeros` como prova · `cta` tema acento ("marca aquele amigo…").
- **Trilha passo a passo**: capa com a promessa ("6 passos pra…") · um slide `numero` por passo (valor "01", legenda "de 06 passos", itens com check, `dica` com meta de tempo) · final tema acento.
- **Antes & depois**: `codigo` com 2 janelas (rotulos "antes"/"depois") + `dica` com o nome da técnica; post único ou carrossel curto.
- **Problema → solução** (produto/case): cada slide com `emoji`, título em 3 tempos ("Foi pra praia. **Tava lotada.** Ninguém avisou."), `dica` "a solução" e `proximo` com a prévia do próximo problema.
- **Apresentação / quem sou**: `numeros` com provas reais, `lista` em cards, `avatar`, final com links.

## Arco
- **Carrossel**: capa (gancho) → contexto/problema → 2–6 slides de desenvolvimento (uma ideia cada) → prova (print/fato/números) → cta.
- **Post único / story**: gancho + prova (ou passo a passo) + interação ou CTA na mesma arte.
- **Reels**: dor → virada → demonstração → final, 15–30s (ver seção Reels).
- **Banner LinkedIn**: posicionamento em uma frase + prova curta (fatos) ou site.

## Reels
Cada slide vira uma **cena** (`duracao` em segundos, mínimo ~0,8s). Tudo abaixo é automático:
- **Transições** entre cenas alternando slide (da direita) e fade, com spring.
- **Entrada em cascata**: kicker revelado por máscara, depois o conteúdo, depois números/dica/figurinha.
- **Emoji** entra com "pop" e flutua; **celular** entra girando em 3D e balança de leve.
- **Marcas animam**: grifo pinta, sublinhado se desenha, riscado corta, números contam de 0, código aparece linha a linha.
- **Contador** "02 / 05" no topo.

Opcionais do post:
- `fundo: "orbs"` → orbs desfocados na cor de destaque derivando devagar (também funciona em estático).
- `musica: { arquivo, inicio?, volume? }` → trilha em `assets/`, com fade de entrada/saída. `inicio` (segundos) = trecho de maior energia da faixa, não o começo dela.
- `telas[].imagem` no layout `celular` → print real da tela dentro da moldura (1 celular por cena fica melhor; rótulo vira chip acima).

Estrutura que funciona (mesma do promo do Litoral na Palma):
1. **Dores** — 2–3 cenas de 1,2–1,8s: `emoji` + pergunta curta ("Praia **lotada**?").
2. **Virada** — 1 cena de 2–3s: a promessa com `==grifo==`.
3. **Demonstração** — 1 cena por recurso, 2–2,5s: `celular` com `imagem` + kicker da categoria + título de 3–5 palavras.
4. **Diferenciais** — `lista` com 3 cards de emoji, 3–3,5s.
5. **Final** — `cta` (logo/handle ou "em breve"), 2,5–3s; `tema: "acento"` se couber.

Regras: texto legível sem som; ≤ 8 palavras por cena de dor/demonstração; print de tela parado (gravação rolando não dá tempo de ler em ~2s).

## Legenda (`legenda.md`)
- 1ª linha = gancho (é o que aparece antes do "ver mais").
- Instagram: parágrafos curtos, CTA explícito, 3–5 hashtags específicas.
- LinkedIn: texto corrido, sem emoji excessivo, até 3 hashtags.
- Story: sem legenda; escreva o texto da figurinha (se houver) e um texto de apoio para Destaques/repost.
- Toda afirmação factual da legenda também precisa estar em `fontes.md`.
