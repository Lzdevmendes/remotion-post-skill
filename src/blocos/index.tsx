import { Fragment, type CSSProperties, type ReactNode } from "react";
import { AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Brand } from "../brand/tipos";
import type { ItemCard, JanelaCodigo, Slide, TelaCelular, Tema } from "../tipos-post";

export const EMOJI = '"Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", sans-serif';

export type Paleta = {
  fundo: string;
  texto: string;
  suave: string;
  rotulo: string;
  linha: string;
  destaque: string;
  superficie: string;
  textoSuperficie: string;
  suaveSuperficie: string;
  destaqueSuperficie: string;
  escuro: boolean;
  acento: boolean;
  superficieEscura: boolean;
};

export function paleta(brand: Brand, tema: Tema = "claro"): Paleta {
  const c = brand.cores;
  const claro: Paleta = {
    fundo: c.fundoClaro,
    texto: c.fundoEscuro,
    suave: c.neutro,
    rotulo: c.neutro,
    linha: c.linha,
    destaque: c.medio,
    superficie: c.superficieClara,
    textoSuperficie: c.fundoEscuro,
    suaveSuperficie: c.neutro,
    destaqueSuperficie: c.medio,
    escuro: false,
    acento: false,
    superficieEscura: false,
  };
  switch (tema) {
    case "tingido":
      return { ...claro, fundo: c.superficieClara, superficie: c.fundoClaro };
    case "escuro":
      return {
        fundo: c.fundoEscuro,
        texto: c.fundoClaro,
        suave: c.ledeSobreEscuro,
        rotulo: c.rotuloSobreEscuro,
        linha: c.linhaSobreEscuro,
        destaque: c.acento,
        superficie: c.superficieEscura,
        textoSuperficie: c.fundoClaro,
        suaveSuperficie: c.rotuloSobreEscuro,
        destaqueSuperficie: c.acento,
        escuro: true,
        acento: false,
        superficieEscura: true,
      };
    case "acento":
      return {
        fundo: c.acento,
        texto: c.fundoEscuro,
        suave: c.superficieEscura,
        rotulo: c.superficieEscura,
        linha: "rgba(0,0,0,.16)",
        destaque: c.fundoEscuro,
        superficie: c.fundoEscuro,
        textoSuperficie: c.fundoClaro,
        suaveSuperficie: c.rotuloSobreEscuro,
        destaqueSuperficie: c.acento,
        escuro: false,
        acento: true,
        superficieEscura: true,
      };
    default:
      return claro;
  }
}

// Paleta para o conteúdo dentro de cards/caixas (a superfície pode ser escura mesmo num tema claro).
export function sobreSuperficie(p: Paleta): Paleta {
  return {
    ...p,
    fundo: p.superficie,
    texto: p.textoSuperficie,
    suave: p.suaveSuperficie,
    rotulo: p.suaveSuperficie,
    linha: p.superficieEscura ? "rgba(255,255,255,.12)" : p.linha,
    destaque: p.destaqueSuperficie,
    escuro: p.superficieEscura,
    acento: false,
  };
}

export const MARCAS = /(==[^=]+==|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~)/g;

export function contarAcentos(slide: Slide): number {
  const itens = (slide.itens ?? []).flatMap((item) => (typeof item === "string" ? [item] : [item.titulo, item.sub ?? ""]));
  const textos = [slide.titulo, slide.corpo, slide.dica?.texto, ...itens].filter(Boolean).join(" ");
  const marcas = textos.match(MARCAS)?.length ?? 0;
  return marcas + (slide.layout === "cta" && slide.botao ? 1 : 0) + (slide.tema === "acento" ? 1 : 0);
}

export function assetSrc(postId: string, arquivo: string) {
  return /^https?:\/\//.test(arquivo) ? arquivo : staticFile(`_assets/${postId}/${arquivo}`);
}

function contar(valor: string, progresso: number) {
  if (progresso >= 1) return valor;
  return valor.replace(/\d+/, (m) => String(Math.round(Number(m) * progresso)).padStart(m.length, "0"));
}

const dois = (n: number) => String(n).padStart(2, "0");

type Base = { brand: Brand; u: number };

export function Marca({ brand, u, p }: Base & { p: Paleta }) {
  return (
    <span style={{ fontFamily: brand.fontes.display, fontWeight: 700, fontSize: 44 * u, letterSpacing: "-0.05em", lineHeight: 1, color: p.texto }}>
      {brand.marca.texto}
      <span style={{ color: p.acento ? brand.cores.fundoClaro : brand.cores.acento }}>{brand.marca.ponto}</span>
    </span>
  );
}

export function ChipEditoria({ brand, u, p, partes }: Base & { p: Paleta; partes: string[] }) {
  const c = brand.cores;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12 * u,
        fontFamily: brand.fontes.display,
        fontSize: 22 * u,
        fontWeight: 600,
        letterSpacing: brand.rotuloTracking,
        textTransform: "uppercase",
        fontVariantNumeric: "tabular-nums",
        padding: `${8 * u}px ${18 * u}px`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        background: p.escuro ? c.superficieEscura : c.fundoEscuro,
        color: p.acento ? c.acento : c.fundoClaro,
      }}
    >
      <span style={{ width: 10 * u, height: 10 * u, borderRadius: 999, background: c.acento, flex: "none" }} />
      {partes.join(" · ")}
    </span>
  );
}

export function BarraProgresso({ brand, u, p, indice, total }: Base & { p: Paleta; indice: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 * u }}>
      <span style={{ fontFamily: brand.fontes.display, fontSize: 24 * u, fontWeight: 600, letterSpacing: "0.08em", color: p.rotulo, fontVariantNumeric: "tabular-nums" }}>
        {dois(indice + 1)} / {dois(total)}
      </span>
      <div style={{ display: "flex", gap: 8 * u }}>
        {Array.from({ length: total }).map((_, k) => (
          <span key={k} style={{ width: (k === indice ? 40 : 12) * u, height: 8 * u, borderRadius: 999, background: k === indice ? p.destaque : p.linha }} />
        ))}
      </div>
    </div>
  );
}

export function Kicker({ brand, u, p, texto }: Base & { p: Paleta; texto: string }) {
  return (
    <div style={{ fontFamily: brand.fontes.mono, fontSize: 24 * u, letterSpacing: "0.06em", color: p.destaque, marginBottom: 22 * u }}>
      {"// "}
      {texto}
    </div>
  );
}

// No reels entra com "pop" (escala + giro) e depois flutua; no estático fica parado.
export function EmojiHero({ u, emoji, animado = false }: { u: number; emoji: string; animado?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = animado ? spring({ frame: frame - 2, fps, config: { damping: 12, mass: 0.6 } }) : 1;
  const flutua = animado ? Math.sin(frame / 46) * 7 * u : 0;
  return (
    <div
      style={{
        alignSelf: "flex-start",
        fontFamily: EMOJI,
        fontSize: 140 * u,
        lineHeight: 1,
        marginBottom: 36 * u,
        transformOrigin: "left bottom",
        opacity: Math.min(1, pop),
        transform: `translateY(${flutua}px) scale(${0.4 + 0.6 * pop}) rotate(${-12 * (1 - pop)}deg)`,
      }}
    >
      {emoji}
    </div>
  );
}

// Orbs desfocados na cor de destaque; no reels derivam devagar (o fundo "respira").
export function FundoOrbs({ u, p, animado = false }: { u: number; p: Paleta; animado?: boolean }) {
  const frame = useCurrentFrame();
  const t = animado ? frame : 0;
  const orbs = [
    { x: 0.14, y: 0.2, s: 760, fase: 0, a: 0.16 },
    { x: 0.9, y: 0.36, s: 600, fase: 2.1, a: 0.12 },
    { x: 0.7, y: 0.9, s: 860, fase: 4.2, a: 0.1 },
  ];
  return (
    <AbsoluteFill style={{ overflow: "hidden", zIndex: 0 }}>
      {orbs.map((o, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${o.x * 100}%`,
            top: `${o.y * 100}%`,
            width: o.s * u,
            height: o.s * u,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${p.destaque} 0%, transparent 70%)`,
            opacity: o.a,
            filter: `blur(${30 * u}px)`,
            transform: `translate(-50%, -50%) translate(${Math.sin(t / 90 + o.fase) * 30 * u}px, ${Math.cos(t / 110 + o.fase) * 30 * u}px)`,
          }}
        />
      ))}
    </AbsoluteFill>
  );
}

export function Rotulo({ brand, u, p, children }: Base & { p: Paleta; children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: brand.fontes.display,
        fontSize: 24 * u,
        fontWeight: 600,
        letterSpacing: brand.rotuloTracking,
        textTransform: "uppercase",
        color: p.rotulo,
        display: "flex",
        alignItems: "center",
        gap: 20 * u,
        marginBottom: 30 * u,
      }}
    >
      <span style={{ whiteSpace: "nowrap" }}>{children}</span>
      <span style={{ flex: 1, height: Math.max(1, 2 * u), background: p.linha }} />
    </div>
  );
}

function Sublinhado({ children, cor, progresso }: { children: ReactNode; cor: string; progresso: number }) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{ position: "absolute", left: "-2%", bottom: "-0.14em", width: "104%", height: "0.24em", overflow: "visible" }}>
        <path
          d="M2 8 C 40 2, 80 11, 120 6 S 180 3, 198 7"
          fill="none"
          stroke={cor}
          strokeWidth={3.5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - progresso}
        />
      </svg>
    </span>
  );
}

// Escrita das marcas: ==grifo== · **destaque** · __sublinhado à mão__ · ~~riscado~~
export function TextoMarcado({ texto, brand, p, progresso = 1 }: { texto: string; brand: Brand; p: Paleta; progresso?: number }) {
  const c = brand.cores;
  return (
    <>
      {texto.split(MARCAS).map((parte, i) => {
        const marca = parte.slice(0, 2);
        if (parte.length <= 4 || marca !== parte.slice(-2) || !["==", "**", "__", "~~"].includes(marca)) return <Fragment key={i}>{parte}</Fragment>;
        const conteudo = parte.slice(2, -2);
        if (marca === "**") {
          return (
            <span key={i} style={{ color: p.destaque }}>
              {conteudo}
            </span>
          );
        }
        if (marca === "~~") {
          const cor = c.alerta ?? p.destaque;
          return (
            <span
              key={i}
              style={{
                backgroundImage: `linear-gradient(${cor}, ${cor})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0 58%",
                backgroundSize: `${progresso * 100}% 0.09em`,
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
              }}
            >
              {conteudo}
            </span>
          );
        }
        if (marca === "__") {
          return (
            <Sublinhado key={i} cor={p.acento ? c.fundoEscuro : c.acento} progresso={progresso}>
              {conteudo}
            </Sublinhado>
          );
        }
        if (p.escuro) {
          return (
            <span key={i} style={{ color: c.acento, opacity: 0.35 + 0.65 * progresso }}>
              {conteudo}
            </span>
          );
        }
        // Faixa só na metade de baixo: um fundo na altura inteira invade a linha de cima e corta descendentes.
        const faixa = p.acento ? c.fundoClaro : c.acento;
        const estilo: CSSProperties = {
          backgroundImage: `linear-gradient(transparent 62%, ${faixa} 62%, ${faixa} 92%, transparent 92%)`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${progresso * 100}% 100%`,
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        };
        return (
          <span key={i} style={estilo}>
            {conteudo}
          </span>
        );
      })}
    </>
  );
}

export function Titulo({ brand, u, p, texto, tamanho, progresso, maxCh }: Base & { p: Paleta; texto: string; tamanho: number; progresso?: number; maxCh?: number }) {
  return (
    <h1
      style={{
        fontFamily: brand.fontes.display,
        fontWeight: 600,
        fontSize: tamanho * u,
        lineHeight: 1.06,
        letterSpacing: brand.tituloTracking,
        textWrap: "balance",
        color: p.texto,
        margin: 0,
        maxWidth: maxCh ? `${maxCh}ch` : undefined,
      }}
    >
      <TextoMarcado texto={texto} brand={brand} p={p} progresso={progresso} />
    </h1>
  );
}

export function Corpo({ brand, u, p, texto, tamanho = 38, progresso }: Base & { p: Paleta; texto: string; tamanho?: number; progresso?: number }) {
  return (
    <p style={{ fontFamily: brand.fontes.texto, fontSize: tamanho * u, lineHeight: 1.45, color: p.suave, margin: 0, textWrap: "pretty" }}>
      <TextoMarcado texto={texto} brand={brand} p={p} progresso={progresso} />
    </p>
  );
}

export function Selo({ brand, u, texto, tipo }: Base & { texto: string; tipo: "ar" | "pronto" | "obra" }) {
  const c = brand.cores;
  const cores = {
    ar: { fundo: c.medio, borda: c.medio, texto: "#fff" },
    pronto: { fundo: c.acentoFundo, borda: "#F0D793", texto: c.acentoTexto },
    obra: { fundo: c.superficieClara, borda: c.linha, texto: c.neutro },
  }[tipo];
  return (
    <span
      style={{
        fontFamily: brand.fontes.display,
        fontSize: 22 * u,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: `${8 * u}px ${20 * u}px`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        border: `${Math.max(1, 2 * u)}px solid ${cores.borda}`,
        background: cores.fundo,
        color: cores.texto,
      }}
    >
      {texto}
    </span>
  );
}

export function Fatos({ brand, u, p, fatos }: Base & { p: Paleta; fatos: string[] }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `${12 * u}px ${14 * u}px` }}>
      {fatos.map((fato) => (
        <span
          key={fato}
          style={{
            fontFamily: brand.fontes.display,
            fontSize: 24 * u,
            fontWeight: 500,
            fontVariantNumeric: "tabular-nums",
            background: p.superficie,
            border: `${Math.max(1, 2 * u)}px solid ${p.linha}`,
            padding: `${6 * u}px ${18 * u}px`,
            borderRadius: brand.raio * u,
            color: p.textoSuperficie,
          }}
        >
          {fato}
        </span>
      ))}
    </div>
  );
}

export function ListaCards({ brand, u, p, itens, progresso }: Base & { p: Paleta; itens: ItemCard[]; progresso: number }) {
  const ps = sobreSuperficie(p);
  const borda = Math.max(1, 2 * u);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 * u }}>
      {itens.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24 * u,
            padding: `${22 * u}px ${26 * u}px`,
            background: ps.fundo,
            border: `${borda}px solid ${ps.linha}`,
            borderLeft: `${6 * u}px solid ${ps.destaque}`,
            borderRadius: brand.raio * 2 * u,
            color: ps.texto,
          }}
        >
          {item.emoji ? (
            <span style={{ flex: "none", width: 72 * u, height: 72 * u, borderRadius: 16 * u, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: EMOJI, fontSize: 40 * u, background: p.fundo }}>
              {item.emoji}
            </span>
          ) : (
            <span style={{ flex: "none", fontFamily: brand.fontes.mono, fontWeight: 500, fontSize: 26 * u, color: ps.destaque }}>{dois(i + 1)}</span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: brand.fontes.display, fontWeight: 600, fontSize: 32 * u, lineHeight: 1.2 }}>
              <TextoMarcado texto={item.titulo} brand={brand} p={ps} progresso={progresso} />
            </div>
            {item.sub && <div style={{ fontFamily: brand.fontes.mono, fontSize: 22 * u, color: ps.suave, marginTop: 6 * u }}>{item.sub}</div>}
          </div>
          {item.icone && <span style={{ flex: "none", fontFamily: brand.fontes.display, fontSize: 34 * u, color: ps.destaque }}>{item.icone === "check" ? "✓" : "→"}</span>}
        </div>
      ))}
    </div>
  );
}

export function GradeNumeros({ brand, u, p, numeros, progresso }: Base & { p: Paleta; numeros: { valor: string; rotulo: string }[]; progresso: number }) {
  const ps = sobreSuperficie(p);
  const colunas = numeros.length === 4 ? 2 : Math.min(numeros.length, 3);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${colunas}, 1fr)`, gap: 16 * u }}>
      {numeros.map((n, i) => (
        <div
          key={i}
          style={{
            background: ps.fundo,
            border: `${Math.max(1, 2 * u)}px solid ${ps.linha}`,
            borderLeft: `${6 * u}px solid ${i === 0 ? ps.destaque : ps.linha}`,
            borderRadius: brand.raio * 2 * u,
            padding: `${24 * u}px ${26 * u}px`,
          }}
        >
          <div style={{ fontFamily: brand.fontes.display, fontWeight: 700, fontSize: 60 * u, lineHeight: 1, letterSpacing: "-0.03em", color: i === 0 ? ps.destaque : ps.texto, fontVariantNumeric: "tabular-nums" }}>
            {contar(n.valor, progresso)}
          </div>
          <div style={{ fontFamily: brand.fontes.mono, fontSize: 20 * u, color: ps.suave, marginTop: 10 * u, lineHeight: 1.35 }}>{n.rotulo}</div>
        </div>
      ))}
    </div>
  );
}

export function NumeroGigante({ brand, u, p, valor, legenda, progresso }: Base & { p: Paleta; valor: string; legenda?: string; progresso: number }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24 * u, marginBottom: 24 * u }}>
      <span style={{ fontFamily: brand.fontes.display, fontWeight: 800, fontSize: 280 * u, lineHeight: 0.82, letterSpacing: "-0.06em", color: p.destaque, fontVariantNumeric: "tabular-nums" }}>
        {contar(valor, progresso)}
      </span>
      {legenda && (
        <span style={{ fontFamily: brand.fontes.mono, fontSize: 26 * u, letterSpacing: "0.08em", textTransform: "uppercase", color: p.rotulo, paddingBottom: 10 * u }}>{legenda}</span>
      )}
    </div>
  );
}

export function Dica({ brand, u, p, dica, progresso }: Base & { p: Paleta; dica: { rotulo: string; texto: string; meta?: string }; progresso: number }) {
  const ps = sobreSuperficie(p);
  return (
    <div
      style={{
        background: ps.fundo,
        border: `${Math.max(1, 2 * u)}px solid ${ps.linha}`,
        borderLeft: `${6 * u}px solid ${ps.destaque}`,
        borderRadius: brand.raio * 2 * u,
        padding: `${26 * u}px ${30 * u}px`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 * u, fontFamily: brand.fontes.mono, fontSize: 22 * u, letterSpacing: "0.08em", marginBottom: 12 * u }}>
        <span style={{ color: ps.destaque, textTransform: "uppercase" }}>{dica.rotulo}</span>
        {dica.meta && <span style={{ color: ps.suave }}>{dica.meta}</span>}
      </div>
      <div style={{ fontFamily: brand.fontes.texto, fontSize: 32 * u, lineHeight: 1.4, color: ps.texto }}>
        <TextoMarcado texto={dica.texto} brand={brand} p={ps} progresso={progresso} />
      </div>
    </div>
  );
}

const TOKENS_CODIGO = /(\/\/.*$|"[^"]*"|'[^']*'|`[^`]*`|\b\d+(?:\.\d+)?\b|\b(?:const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|new|class|interface|type|def|print|true|false|null|undefined)\b)/g;

function Sintaxe({ texto, brand }: { texto: string; brand: Brand }) {
  const c = brand.cores;
  return (
    <>
      {texto.split(TOKENS_CODIGO).map((t, i) => {
        if (!t) return null;
        let estilo: CSSProperties | undefined;
        if (t.startsWith("//")) estilo = { color: c.ledeSobreEscuro, opacity: 0.7, fontStyle: "italic" };
        else if (/^["'`]/.test(t)) estilo = { color: c.rotuloSobreEscuro };
        else if (/^\d/.test(t) || /^[a-z]+$/.test(t)) estilo = { color: c.acento };
        return (
          <span key={i} style={estilo}>
            {t}
          </span>
        );
      })}
    </>
  );
}

export function JanelasCodigo({ brand, u, janelas, progresso }: Base & { janelas: JanelaCodigo[]; progresso: number }) {
  const c = brand.cores;
  const duas = janelas.length > 1;
  return (
    <div style={{ display: "flex", gap: 20 * u }}>
      {janelas.map((janela, idx) => (
        <div key={idx} style={{ flex: "1 1 0", minWidth: 0 }}>
          {janela.rotulo && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10 * u,
                fontFamily: brand.fontes.display,
                fontWeight: 600,
                fontSize: 22 * u,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: duas && idx === 0 ? (c.alerta ?? c.neutro) : c.medio,
                marginBottom: 12 * u,
              }}
            >
              <span style={{ width: 12 * u, height: 12 * u, borderRadius: 999, background: "currentColor" }} />
              {janela.rotulo}
            </div>
          )}
          <div style={{ background: c.fundoEscuro, borderRadius: brand.raio * 3 * u, overflow: "hidden", border: `${Math.max(1, 2 * u)}px solid ${c.superficieEscura}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 * u, padding: `${16 * u}px ${20 * u}px`, background: c.superficieEscura }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map((cor) => (
                <span key={cor} style={{ width: 14 * u, height: 14 * u, borderRadius: 999, background: cor }} />
              ))}
              <span style={{ marginLeft: 12 * u, fontFamily: brand.fontes.mono, fontSize: 20 * u, color: c.rotuloSobreEscuro }}>{janela.arquivo}</span>
            </div>
            <div style={{ padding: `${18 * u}px ${20 * u}px ${22 * u}px`, fontFamily: brand.fontes.mono, fontSize: (duas ? 21 : 24) * u, lineHeight: 1.65, overflow: "hidden" }}>
              {janela.linhas.slice(0, Math.max(1, Math.ceil(janela.linhas.length * progresso))).map((linha, n) => (
                <div key={n} style={{ display: "flex", gap: 18 * u, whiteSpace: "pre" }}>
                  <span style={{ color: c.rotuloSobreEscuro, opacity: 0.5, minWidth: 24 * u, textAlign: "right", flex: "none" }}>{n + 1}</span>
                  <span style={{ color: c.fundoClaro }}>
                    <Sintaxe texto={linha} brand={brand} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Tela({ brand, u, p, postId, imagem, alturaMax, encaixe = "cobrir" }: Base & { p: Paleta; postId: string; imagem?: string; alturaMax?: number; encaixe?: "cobrir" | "inteiro" }) {
  const src = imagem ? assetSrc(postId, imagem) : null;
  const inteiro = encaixe === "inteiro";
  return (
    <div
      style={{
        width: "100%",
        // "inteiro": altura fixa e imagem contida — arte vertical (4:5, 9:16) aparece sem corte.
        aspectRatio: inteiro ? undefined : "16 / 10",
        height: inteiro ? (alturaMax ?? 620 * u) : undefined,
        maxHeight: inteiro ? undefined : alturaMax,
        background: brand.cores.telaGradiente,
        border: `${Math.max(1, 2 * u)}px solid ${p.linha}`,
        borderRadius: brand.raio * u,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: brand.cores.telaTexto,
        fontFamily: brand.fontes.display,
        fontSize: 22 * u,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {src ? <Img src={src} style={{ width: "100%", height: "100%", objectFit: inteiro ? "contain" : "cover" }} /> : "print do projeto"}
    </div>
  );
}

// Moldura de celular: com `imagem` mostra o print real (proporção de aparelho); sem, desenha os passos em "telinhas".
// No reels entra girando em 3D e fica balançando de leve.
export function Celular({ brand, u, tela, postId, animado = false }: Base & { tela: TelaCelular; postId: string; animado?: boolean }) {
  const c = brand.cores;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = animado ? spring({ frame: frame - 6, fps, config: { damping: 26, mass: 1.8, stiffness: 42 } }) : 1;
  const giro = animado ? (1 - entrada) * 40 + Math.sin(frame / 70) * 3 : 0;
  const flutua = animado ? Math.sin(frame / 40) * 6 * u : 0;
  const comPrint = Boolean(tela.imagem);
  const ilha = <div style={{ alignSelf: "center", width: 110 * u, height: 32 * u, borderRadius: 999, background: c.fundoEscuro, flex: "none" }} />;

  return (
    <div style={{ flex: "1 1 0", maxWidth: 400 * u, perspective: 1600 * u, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 * u }}>
      {comPrint && tela.rotulo && (
        <span
          style={{
            fontFamily: brand.fontes.display,
            fontSize: 24 * u,
            fontWeight: 600,
            padding: `${6 * u}px ${18 * u}px`,
            borderRadius: 999,
            background: c.superficieClara,
            border: `${Math.max(1, 2 * u)}px solid ${c.linha}`,
            color: c.fundoEscuro,
          }}
        >
          {tela.rotulo}
        </span>
      )}
      <div
        style={{
          width: "100%",
          aspectRatio: comPrint ? "9 / 19.5" : "9 / 11",
          background: c.fundoEscuro,
          borderRadius: (comPrint ? 70 : 60) * u,
          padding: 12 * u,
          boxShadow: `0 ${24 * u}px ${56 * u}px rgba(0,0,0,.14)`,
          opacity: animado ? Math.min(1, entrada * 1.5) : 1,
          transform: `rotateY(${giro}deg) translateY(${flutua}px) scale(${0.85 + 0.15 * entrada})`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: c.fundoClaro,
            borderRadius: (comPrint ? 58 : 48) * u,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            padding: comPrint ? 0 : `${20 * u}px ${22 * u}px`,
          }}
        >
          {comPrint && tela.imagem ? (
            <>
              <Img src={assetSrc(postId, tela.imagem)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              <div style={{ position: "absolute", top: 18 * u, left: 0, right: 0, display: "flex", justifyContent: "center" }}>{ilha}</div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 30 * u }}>{ilha}</div>
              {/* Sem caixa alta: rótulo de tela costuma ser nome de marca (iPhone, Android). */}
              <div style={{ fontFamily: brand.fontes.display, fontSize: 26 * u, fontWeight: 600, letterSpacing: "-0.01em", color: c.neutro, marginBottom: 18 * u }}>
                {tela.rotulo}
              </div>
              {(tela.passos ?? []).map((passo, i, passos) => {
                const final = i === passos.length - 1;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14 * u,
                      padding: `${16 * u}px ${16 * u}px`,
                      marginBottom: 12 * u,
                      borderRadius: brand.raio * 3 * u,
                      background: final ? c.medio : c.superficieClara,
                      border: `${Math.max(1, 2 * u)}px solid ${final ? c.medio : c.linha}`,
                      color: final ? "#fff" : c.fundoEscuro,
                    }}
                  >
                    <span
                      style={{
                        flex: "none",
                        width: 36 * u,
                        height: 36 * u,
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: brand.fontes.display,
                        fontSize: 20 * u,
                        fontWeight: 700,
                        background: final ? "rgba(255,255,255,.2)" : c.fundoEscuro,
                        color: final ? "#fff" : c.fundoClaro,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontFamily: brand.fontes.display, fontSize: 28 * u, fontWeight: 500, lineHeight: 1.2 }}>{passo}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Área tracejada que o usuário cobre com a figurinha do Instagram (enquete, quiz, caixinha).
export function AreaSticker({ brand, u, p, dica }: Base & { p: Paleta; dica: string }) {
  const cor = p.escuro ? brand.cores.rotuloSobreEscuro : p.destaque;
  return (
    <div
      style={{
        height: 150 * u,
        border: `${3 * u}px dashed ${cor}`,
        borderRadius: 28 * u,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: `0 ${40 * u}px`,
        fontFamily: brand.fontes.display,
        fontSize: 26 * u,
        fontWeight: 500,
        color: cor,
      }}
    >
      {dica}
    </div>
  );
}

export function Botao({ brand, u, texto, p }: Base & { texto: string; p?: Paleta }) {
  const invertido = p?.acento ?? false;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16 * u,
        fontFamily: brand.fontes.display,
        fontSize: 36 * u,
        fontWeight: 600,
        padding: `${26 * u}px ${46 * u}px`,
        borderRadius: 2 * u,
        background: invertido ? brand.cores.fundoEscuro : brand.cores.acento,
        color: invertido ? brand.cores.acento : brand.cores.fundoEscuro,
      }}
    >
      {texto}
    </span>
  );
}
