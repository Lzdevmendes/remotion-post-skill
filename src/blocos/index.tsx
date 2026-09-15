import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Img, staticFile } from "remotion";
import type { Brand } from "../brand/tipos";
import type { Slide, TelaCelular, Tema } from "../tipos-post";

export type Paleta = {
  fundo: string;
  texto: string;
  suave: string;
  rotulo: string;
  linha: string;
  escuro: boolean;
};

export function paleta(brand: Brand, tema: Tema = "claro"): Paleta {
  const c = brand.cores;
  if (tema === "escuro") {
    return { fundo: c.fundoEscuro, texto: c.fundoClaro, suave: c.ledeSobreEscuro, rotulo: c.rotuloSobreEscuro, linha: c.linhaSobreEscuro, escuro: true };
  }
  return {
    fundo: tema === "tingido" ? c.superficieClara : c.fundoClaro,
    texto: c.fundoEscuro,
    suave: c.neutro,
    rotulo: c.neutro,
    linha: c.linha,
    escuro: false,
  };
}

export function contarAcentos(slide: Slide): number {
  const textos = [slide.titulo, slide.corpo, ...(slide.itens ?? [])].filter(Boolean).join(" ");
  const grifos = textos.match(/==[^=]+==/g)?.length ?? 0;
  return grifos + (slide.layout === "cta" && slide.botao ? 1 : 0);
}

type Base = { brand: Brand; u: number };

export function Marca({ brand, u, cor }: Base & { cor: string }) {
  return (
    <span style={{ fontFamily: brand.fontes.display, fontWeight: 700, fontSize: 44 * u, letterSpacing: "-0.05em", lineHeight: 1, color: cor }}>
      {brand.marca.texto}
      <span style={{ color: brand.cores.acento }}>{brand.marca.ponto}</span>
    </span>
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

export function TextoComGrifo({ texto, brand, p, progresso = 1 }: { texto: string; brand: Brand; p: Paleta; progresso?: number }) {
  const acento = brand.cores.acento;
  return (
    <>
      {texto.split(/(==[^=]+==)/g).map((parte, i) => {
        if (!(parte.startsWith("==") && parte.endsWith("==") && parte.length > 4)) return <Fragment key={i}>{parte}</Fragment>;
        const conteudo = parte.slice(2, -2);
        if (p.escuro) {
          return (
            <span key={i} style={{ color: acento, opacity: 0.35 + 0.65 * progresso }}>
              {conteudo}
            </span>
          );
        }
        const estilo: CSSProperties = {
          backgroundImage: `linear-gradient(transparent 62%, ${acento} 62%, ${acento} 92%, transparent 92%)`,
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
      <TextoComGrifo texto={texto} brand={brand} p={p} progresso={progresso} />
    </h1>
  );
}

export function Corpo({ brand, u, p, texto, tamanho = 38, progresso }: Base & { p: Paleta; texto: string; tamanho?: number; progresso?: number }) {
  return (
    <p style={{ fontFamily: brand.fontes.texto, fontSize: tamanho * u, lineHeight: 1.45, color: p.suave, margin: 0, textWrap: "pretty" }}>
      <TextoComGrifo texto={texto} brand={brand} p={p} progresso={progresso} />
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

export function SeloSerie({ brand, u, p, nome, numero }: Base & { p: Paleta; nome: string; numero: number }) {
  const c = brand.cores;
  return (
    <span
      style={{
        fontFamily: brand.fontes.display,
        fontSize: 22 * u,
        fontWeight: 600,
        letterSpacing: brand.rotuloTracking,
        textTransform: "uppercase",
        fontVariantNumeric: "tabular-nums",
        padding: `${8 * u}px ${18 * u}px`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        background: p.escuro ? c.fundoClaro : c.fundoEscuro,
        color: p.escuro ? c.fundoEscuro : c.fundoClaro,
      }}
    >
      {nome} #{String(numero).padStart(2, "0")}
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
            background: p.escuro ? brand.cores.superficieEscura : brand.cores.superficieClara,
            border: `${Math.max(1, 2 * u)}px solid ${p.linha}`,
            padding: `${6 * u}px ${18 * u}px`,
            borderRadius: brand.raio * u,
            color: p.escuro ? p.texto : brand.cores.fundoEscuro,
          }}
        >
          {fato}
        </span>
      ))}
    </div>
  );
}

export function Tela({ brand, u, p, postId, imagem, alturaMax }: Base & { p: Paleta; postId: string; imagem?: string; alturaMax?: number }) {
  const src = imagem ? (/^https?:\/\//.test(imagem) ? imagem : staticFile(`_assets/${postId}/${imagem}`)) : null;
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "16 / 10",
        maxHeight: alturaMax,
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
      {src ? <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "print do projeto"}
    </div>
  );
}

// Moldura de celular com os passos em "telinhas": o último passo fica destacado em cor média (não conta como acento).
export function Celular({ brand, u, tela }: Base & { tela: TelaCelular }) {
  const c = brand.cores;
  return (
    <div
      style={{
        flex: "1 1 0",
        maxWidth: 400 * u,
        aspectRatio: "9 / 11",
        background: c.fundoEscuro,
        borderRadius: 60 * u,
        padding: 12 * u,
        boxShadow: `0 ${24 * u}px ${56 * u}px rgba(0,0,0,.14)`,
      }}
    >
      <div style={{ width: "100%", height: "100%", background: c.fundoClaro, borderRadius: 48 * u, overflow: "hidden", display: "flex", flexDirection: "column", padding: `${20 * u}px ${22 * u}px` }}>
        <div style={{ alignSelf: "center", width: 110 * u, height: 32 * u, borderRadius: 999, background: c.fundoEscuro, marginBottom: 30 * u, flex: "none" }} />
        {/* Sem caixa alta: rótulo de tela costuma ser nome de marca (iPhone, Android). */}
        <div style={{ fontFamily: brand.fontes.display, fontSize: 26 * u, fontWeight: 600, letterSpacing: "-0.01em", color: c.neutro, marginBottom: 18 * u }}>
          {tela.rotulo}
        </div>
        {tela.passos.map((passo, i) => {
          const final = i === tela.passos.length - 1;
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
      </div>
    </div>
  );
}

// Área tracejada que o usuário cobre com a figurinha do Instagram (enquete, quiz, caixinha).
export function AreaSticker({ brand, u, p, dica }: Base & { p: Paleta; dica: string }) {
  const cor = p.escuro ? brand.cores.rotuloSobreEscuro : brand.cores.medio;
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

export function Botao({ brand, u, texto }: Base & { texto: string }) {
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
        background: brand.cores.acento,
        color: brand.cores.fundoEscuro,
      }}
    >
      {texto}
    </span>
  );
}
