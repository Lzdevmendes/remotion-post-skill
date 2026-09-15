# Ler o design de um projeto → brand.json

Objetivo: preencher `public/brands/<brand>/brand.json` no estúdio com os valores **reais** do projeto. Nunca invente cor ou fonte. O que não for encontrado, pergunte.

## Onde procurar (nesta ordem)
1. **CSS global com custom properties**: `src/app/globals.css`, `app/globals.css`, `src/styles/*.css`, `styles/*.css`. Procure por `:root{` e `@font-face`.
   `grep -rn -- "--[a-z0-9-]*:" <arquivo> | head -60`
2. **Tailwind v4**: bloco `@theme { --color-*, --font-* }` no CSS.
3. **Tailwind v3**: `tailwind.config.{js,ts}` → `theme.extend.colors`, `fontFamily`.
4. **next/font**: `src/app/layout.tsx` → `import { X } from "next/font/google"` ou `next/font/local` (caminho dos arquivos).
5. **React Native / Expo**: `theme.ts`, `constants/Colors.ts`, `src/theme/*`, `useFonts({...})` com os arquivos em `assets/fonts`.
6. **Sem nada acima**: `index.html`/CSS estático, ou pergunte ao usuário.

## Mapeamento para brand.json
| Campo | O que é |
|---|---|
| `cores.fundoEscuro` | cor do texto principal / fundos escuros |
| `cores.superficieEscura` | variação um pouco mais clara do fundo escuro |
| `cores.medio` | cor de links/estados/dados |
| `cores.fundoClaro` · `superficieClara` | fundo da página · fundo de seção tingida |
| `cores.linha` · `linhaSobreEscuro` | bordas/divisores no claro · no escuro |
| `cores.neutro` | texto secundário |
| `cores.rotuloSobreEscuro` · `ledeSobreEscuro` | texto secundário sobre fundo escuro |
| `cores.acento` · `acentoFundo` · `acentoTexto` | cor de destaque · fundo suave dela · texto legível sobre esse fundo |
| `cores.telaGradiente` · `telaTexto` | fundo da moldura de print (placeholder) |
| `fontes.display` · `texto` · `mono` | família de títulos · de corpo · monoespaçada |
| `arquivosFonte[]` | um item por `@font-face`: `family`, `arquivo`, `weight` (ex.: `"400 800"` para variável), `style`, `unicodeRange` copiado literalmente |
| `googleFonts[]` | fontes sem arquivo local; o nome deve existir no mapa `GOOGLE_FONTS` de `src/brand/fontes.ts` (adicione a entrada se faltar: `import("@remotion/google-fonts/<Nome>")`) |
| `raio` | border-radius base em px |
| `rotuloTracking` · `tituloTracking` | letter-spacing de rótulos e títulos |
| `maxAcentosPorArte` | regra de uso do acento, se o projeto tiver (comentário no CSS/README); padrão 3 |
| `marca` | logotipo em texto (ex.: `lz` + `.` na cor de acento) |
| `site` · `handle` | domínio e @/URL da rede; procure no conteúdo/rodapé do projeto; se não houver, pergunte |

Faltou um papel (ex.: o projeto não tem fundo escuro)? Derive do mais próximo e **diga isso no resumo** da Fase 1.

## Fontes
- Copie os arquivos (`.woff2`, `.woff`, `.ttf`, `.otf`) para `"$ESTUDIO/public/brands/<brand>/fonts/"`, sempre com o destino entre aspas.
- Mantenha os pares latin/latin-ext **com** `unicodeRange`; sem ele o arquivo ext sobrescreve os glifos básicos.
- Verifique a licença antes de copiar fonte comercial para uma brand que vai para repositório público (Google Fonts/OFL podem ser redistribuídas).
- `next/font/google` sem arquivo local: use `googleFonts`.

## Exemplos
- `public/brands/lz-landing/brand.json` — real, extraído do `globals.css` de uma landing Next.js (`@font-face` self-hosted + `:root` com custom properties).
- `public/brands/exemplo/brand.json` — neutra, só com Google Fonts (sem arquivos locais).
