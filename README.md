# remotion-post-skill

**[English](#english) · [Português](#português)**

<p align="center"><code>/post</code> — social media posts generated in code, with <em>your</em> project's design.</p>

---

## English

A [Claude Code](https://claude.com/claude-code) skill + a [Remotion](https://www.remotion.dev) studio that turns a single command into on-brand social media posts. Run `/post` inside any project and it:

1. **Reads the project's design** — CSS custom properties, `@font-face`, Tailwind theme, `next/font`, React Native theme — into a `brand.json`.
2. **Interviews you** (grill-me style) until the post has a hook, a thesis, proof and a call to action.
3. **Researches the topic** — every number needs a source in `fontes.md`.
4. **Shows the script in plan mode**, slide by slide, for your approval.
5. **Renders** PNG/MP4 with the exact fonts and colors of your project.
6. **Checks every image** (cut text, fallback fonts, safe zones) before handing it over.

### Formats

| format | size | output |
|---|---|---|
| Carousel (Instagram/LinkedIn) | 1080×1350 | one PNG per slide |
| Single post | 1080×1350 or 1080×1080 | PNG |
| Story | 1080×1920 (250px safe zones) | PNG |
| LinkedIn banner | 1584×396 (cover) or 1200×627 (post) | PNG @2x |
| Reels | 1080×1920, 30fps | MP4 (H.264, CRF 18) |

Layouts: `capa` (cover), `texto` (text), `lista` (list), `print` (screenshot), `cta`. Highlights are written as `==text==`.

### Requirements

- Node.js 20+
- Claude Code
- `ffmpeg`/`ffprobe` (optional, used to verify reels)

### Install

```bash
git clone https://github.com/Lzdevmendes/remotion-post-skill.git
cd remotion-post-skill
npm install
npx remotion browser ensure

# link the skill
ln -s "$PWD/skill" ~/.claude/skills/post

# where finished posts are saved
cp config.example.json config.local.json   # then edit "postsDir"
```

### Use

Inside any project, in Claude Code:

```
/post
```

Render manually (e.g. after editing a `post.json`):

```bash
npm run render -- "2026-09-14 (my topic)"     # folder inside postsDir
npm run render -- exemplos/carrossel           # bundled examples
npm run studio                                 # Remotion Studio, live preview
```

Each post lives in its own folder: `postsDir/YYYY-MM-DD (topic)/` with `post.json`, `roteiro.md`, `legenda.md`, `fontes.md`, `assets/` and the rendered files.

### Brands

`public/brands/<id>/brand.json` holds colors, fonts, radius and tracking. Two examples ship with the repo:
- `exemplo` — neutral, Google Fonts only.
- `lz-landing` — a real brand extracted from a Next.js landing page (self-hosted fonts).

The skill creates new brands automatically from the project you are in.

### Code language

The skill, types and components are written in Brazilian Portuguese (`slide.titulo` = title, `corpo` = body, `rotulo` = label, `fatos` = facts, `botao` = button). Contributions with translations are welcome.

### License

Code: [MIT](LICENSE). **Remotion has its own license**: free for individuals, companies with up to 3 employees and non-profits; larger companies need a [Company License](https://www.remotion.pro/license). Bundled fonts are under the SIL Open Font License.

---

## Português

Uma skill do [Claude Code](https://claude.com/claude-code) + um estúdio [Remotion](https://www.remotion.dev) que transforma um comando em posts com a identidade visual do seu projeto. Rode `/post` dentro de qualquer projeto e ela:

1. **Lê o design do projeto** — custom properties do CSS, `@font-face`, tema do Tailwind, `next/font`, tema do React Native — e gera um `brand.json`.
2. **Te entrevista** (estilo grill-me) até o post ter gancho, tese, prova e CTA.
3. **Pesquisa o tema** — todo número precisa de fonte em `fontes.md`.
4. **Mostra o roteiro em plan mode**, slide a slide, para você aprovar.
5. **Renderiza** PNG/MP4 com as fontes e cores exatas do projeto.
6. **Confere cada imagem** (texto cortado, fonte de fallback, margens de segurança) antes de entregar.

### Formatos

| formato | tamanho | saída |
|---|---|---|
| Carrossel (Instagram/LinkedIn) | 1080×1350 | um PNG por slide |
| Post único | 1080×1350 ou 1080×1080 | PNG |
| Story | 1080×1920 (margem de 250px) | PNG |
| Banner LinkedIn | 1584×396 (capa) ou 1200×627 (post) | PNG @2x |
| Reels | 1080×1920, 30fps | MP4 (H.264, CRF 18) |

Layouts: `capa`, `texto`, `lista`, `print`, `cta`. Destaques são escritos como `==texto==`.

### Requisitos

- Node.js 20+
- Claude Code
- `ffmpeg`/`ffprobe` (opcional, para verificar reels)

### Instalação

```bash
git clone https://github.com/Lzdevmendes/remotion-post-skill.git
cd remotion-post-skill
npm install
npx remotion browser ensure

# linka a skill
ln -s "$PWD/skill" ~/.claude/skills/post

# onde os posts prontos são salvos
cp config.example.json config.local.json   # depois edite "postsDir"
```

### Uso

Dentro de qualquer projeto, no Claude Code:

```
/post
```

Renderizar manualmente (ex.: depois de editar um `post.json`):

```bash
npm run render -- "2026-09-14 (meu tema)"      # pasta dentro de postsDir
npm run render -- exemplos/carrossel           # exemplos do repo
npm run studio                                 # Remotion Studio, preview ao vivo
```

Cada post fica na própria pasta: `postsDir/AAAA-MM-DD (tema)/` com `post.json`, `roteiro.md`, `legenda.md`, `fontes.md`, `assets/` e as artes renderizadas.

### Brands

`public/brands/<id>/brand.json` guarda cores, fontes, raio e tracking. Dois exemplos vêm no repo:
- `exemplo` — neutra, só Google Fonts.
- `lz-landing` — brand real extraída de uma landing Next.js (fontes self-hosted).

A skill cria brands novas automaticamente a partir do projeto em que você estiver.

### Licença

Código: [MIT](LICENSE). **O Remotion tem licença própria**: gratuito para pessoas físicas, empresas com até 3 funcionários e organizações sem fins lucrativos; empresas maiores precisam de uma [Company License](https://www.remotion.pro/license). As fontes incluídas são SIL Open Font License.
