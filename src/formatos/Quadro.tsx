import type { ReactNode } from "react";
import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Brand } from "../brand/tipos";
import {
  AreaSticker,
  assetSrc,
  BarraProgresso,
  Botao,
  Celular,
  ChipEditoria,
  Corpo,
  Dica,
  EMOJI,
  EmojiHero,
  Fatos,
  FundoOrbs,
  GradeNumeros,
  JanelasCodigo,
  Kicker,
  ListaCards,
  Marca,
  NumeroGigante,
  paleta,
  Rotulo,
  Selo,
  Tela,
  Titulo,
} from "../blocos";
import type { ItemCard, Post, Slide } from "../tipos-post";

type QuadroProps = {
  post: Post;
  brand: Brand;
  slide: Slide;
  indice: number;
  progresso?: number;
  animado?: boolean;
};

// Entrada em cascata (reels): cada bloco sobe com spring, atrasado em quadros.
function Revelar({ animado, atraso, u, children }: { animado: boolean; atraso: number; u: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!animado) return <>{children}</>;
  const t = spring({ frame: frame - atraso, fps, config: { damping: 200, mass: 0.7 } });
  return <div style={{ opacity: t, transform: `translateY(${(1 - t) * 48 * u}px)` }}>{children}</div>;
}

// Revelação por máscara: a linha sobe de dentro de um overflow:hidden (padding negativo protege descendentes).
function Mascara({ animado, atraso, children }: { animado: boolean; atraso: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!animado) return <>{children}</>;
  const t = spring({ frame: frame - atraso, fps, config: { damping: 200, mass: 0.7 } });
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.2em", marginBottom: "-0.2em" }}>
      <div style={{ transform: `translateY(${(1 - t) * 110}%)`, opacity: t }}>{children}</div>
    </div>
  );
}

export function Quadro({ post, brand, slide, indice, progresso = 1, animado = false }: QuadroProps) {
  const { width, height } = useVideoConfig();
  const u = Math.min(width, height * 1.25) / 1080;
  const horizontal = width / height > 1.6;
  const vertical = height / width > 1.5;
  // Na capa do LinkedIn a foto de perfil cobre o terço esquerdo: conteúdo vai para a direita.
  const capaLinkedin = post.formato === "banner-linkedin" && post.variante !== "post";
  const temaPadrao = slide.layout === "cta" ? "escuro" : "claro";
  const p = paleta(brand, slide.tema ?? temaPadrao);

  const margemLateral = (horizontal ? 64 : 88) * u;
  const margemVertical = (vertical ? 250 : horizontal ? 48 : 80) * u;
  const total = post.slides.length;
  const ehCarrossel = post.formato === "carrossel";
  const mostraProgresso = (ehCarrossel || post.formato === "reels") && total > 1 && !horizontal;
  const ultimo = indice === total - 1;

  const partesChip = [post.editoria, post.serie ? `${post.serie.nome} #${String(post.serie.numero).padStart(2, "0")}` : undefined].filter(
    (parte): parte is string => Boolean(parte),
  );
  const ctaRodape = ehCarrossel
    ? ultimo
      ? null
      : slide.proximo
        ? `próximo: ${slide.proximo} →`
        : indice === 0
          ? "arraste →"
          : "próximo →"
    : (slide.proximo ?? null);

  const conteudo = horizontal ? (
    <ConteudoHorizontal brand={brand} slide={slide} p={p} u={u} postId={post.id} progresso={progresso} animado={animado} capaLinkedin={capaLinkedin} />
  ) : (
    <ConteudoVertical brand={brand} slide={slide} p={p} u={u} postId={post.id} progresso={progresso} animado={animado} vertical={vertical} />
  );

  return (
    <AbsoluteFill style={{ background: p.fundo, color: p.texto, padding: `${margemVertical}px ${margemLateral}px`, display: "flex", flexDirection: "column" }}>
      {post.fundo === "orbs" && <FundoOrbs u={u} p={p} animado={animado} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: capaLinkedin ? "flex-end" : "space-between", gap: 24 * u, position: "relative", zIndex: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u }}>
          <Marca brand={brand} u={u * (horizontal ? 1.3 : 1)} p={p} />
          {partesChip.length > 0 && !horizontal && <ChipEditoria brand={brand} u={u} p={p} partes={partesChip} />}
        </div>
        {slide.selo ? (
          <Selo brand={brand} u={u} texto={slide.selo.texto} tipo={slide.selo.tipo} />
        ) : mostraProgresso ? (
          <BarraProgresso brand={brand} u={u} p={p} indice={indice} total={total} />
        ) : null}
      </div>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: slide.layout === "capa" || slide.layout === "cta" ? "flex-end" : "center",
          paddingBlock: (horizontal ? 12 : 48) * u,
          position: "relative",
          zIndex: 1,
        }}
      >
        {!horizontal && slide.emoji && <EmojiHero u={u} emoji={slide.emoji} animado={animado} />}
        {!horizontal && slide.kicker && (
          <Mascara animado={animado} atraso={0}>
            <Kicker brand={brand} u={u} p={p} texto={slide.kicker} />
          </Mascara>
        )}
        <Revelar animado={animado} atraso={5} u={u}>
          {conteudo}
        </Revelar>
        {!horizontal && slide.numeros && (
          <Revelar animado={animado} atraso={12} u={u}>
            <div style={{ marginTop: 36 * u }}>
              <GradeNumeros brand={brand} u={u} p={p} numeros={slide.numeros} progresso={progresso} />
            </div>
          </Revelar>
        )}
        {!horizontal && slide.dica && (
          <Revelar animado={animado} atraso={14} u={u}>
            <div style={{ marginTop: 32 * u }}>
              <Dica brand={brand} u={u} p={p} dica={slide.dica} progresso={progresso} />
            </div>
          </Revelar>
        )}
        {slide.sticker && !horizontal && (
          <Revelar animado={animado} atraso={18} u={u}>
            <div style={{ marginTop: 40 * u }}>
              <AreaSticker brand={brand} u={u} p={p} dica={slide.sticker.dica} />
            </div>
          </Revelar>
        )}
      </div>

      {slide.avatar && !horizontal && (
        <Img
          src={assetSrc(post.id, slide.avatar)}
          style={{
            position: "absolute",
            right: margemLateral * 0.4,
            bottom: margemVertical + 70 * u,
            width: "46%",
            maxHeight: "55%",
            objectFit: "contain",
            objectPosition: "bottom right",
            zIndex: 2,
          }}
        />
      )}

      {!horizontal && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 24 * u,
            borderTop: `${Math.max(1, 2 * u)}px solid ${p.linha}`,
            paddingTop: 26 * u,
            fontFamily: brand.fontes.display,
            fontSize: 24 * u,
            fontWeight: 500,
            color: p.rotulo,
            position: "relative",
            zIndex: 3,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 16 * u }}>
            {brand.site}
            {brand.assinatura && <span style={{ fontFamily: EMOJI, letterSpacing: "0.15em" }}>{brand.assinatura}</span>}
          </span>
          {ctaRodape ? (
            <span style={{ color: p.destaque, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "right" }}>{ctaRodape}</span>
          ) : (
            <span>{brand.handle}</span>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
}

type ConteudoProps = { brand: Brand; slide: Slide; p: ReturnType<typeof paleta>; u: number; postId: string; progresso: number; animado: boolean };

function ConteudoVertical({ brand, slide, p, u, postId, progresso, animado, vertical }: ConteudoProps & { vertical: boolean }) {
  const escala = vertical ? 1.1 : 1;
  switch (slide.layout) {
    case "capa":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={112 * escala} progresso={progresso} maxCh={17} />}
          {slide.corpo && <div style={{ marginTop: 40 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={40} progresso={progresso} /></div>}
        </>
      );
    case "texto":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={80 * escala} progresso={progresso} />}
          {slide.corpo && <div style={{ marginTop: 40 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} progresso={progresso} /></div>}
        </>
      );
    case "lista": {
      const itens = slide.itens ?? [];
      const emCards = itens.some((item) => typeof item !== "string");
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={68 * escala} progresso={progresso} />}
          <div style={{ marginTop: 44 * u }}>
            {emCards ? (
              <ListaCards brand={brand} u={u} p={p} itens={itens.map((item): ItemCard => (typeof item === "string" ? { titulo: item } : item))} progresso={progresso} />
            ) : (
              (itens as string[]).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 28 * u, alignItems: "baseline", padding: `${24 * u}px 0`, borderTop: `${Math.max(1, 2 * u)}px solid ${p.linha}` }}>
                  <span
                    style={{
                      fontFamily: brand.fontes.display,
                      fontWeight: 700,
                      fontSize: 30 * u,
                      color: p.escuro ? brand.cores.rotuloSobreEscuro : p.acento ? brand.cores.fundoEscuro : brand.cores.medio,
                      fontVariantNumeric: "tabular-nums",
                      flex: "none",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Corpo brand={brand} u={u} p={{ ...p, suave: p.texto }} texto={item} tamanho={36} progresso={progresso} />
                </div>
              ))
            )}
          </div>
        </>
      );
    }
    case "print":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={60 * escala} progresso={progresso} />}
          <div style={{ marginTop: 40 * u }}>
            <Tela brand={brand} u={u} p={p} postId={postId} imagem={slide.imagem} />
          </div>
          {slide.corpo && <div style={{ marginTop: 32 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={32} progresso={progresso} /></div>}
          {slide.fatos && <div style={{ marginTop: 28 * u }}><Fatos brand={brand} u={u} p={p} fatos={slide.fatos} /></div>}
        </>
      );
    case "celular":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={64 * escala} progresso={progresso} />}
          <div style={{ marginTop: 44 * u, display: "flex", gap: 32 * u, justifyContent: "center" }}>
            {(slide.telas ?? []).map((tela, i) => (
              <Celular key={i} brand={brand} u={u} tela={tela} postId={postId} animado={animado} />
            ))}
          </div>
          {slide.corpo && <div style={{ marginTop: 40 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={34} progresso={progresso} /></div>}
        </>
      );
    case "numero":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.numero && <NumeroGigante brand={brand} u={u} p={p} valor={slide.numero.valor} legenda={slide.numero.legenda} progresso={progresso} />}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={76 * escala} progresso={progresso} />}
          {slide.corpo && <div style={{ marginTop: 30 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={34} progresso={progresso} /></div>}
          {slide.itens && slide.itens.length > 0 && (
            <div style={{ marginTop: 36 * u }}>
              <ListaCards brand={brand} u={u} p={p} itens={slide.itens.map((item): ItemCard => (typeof item === "string" ? { titulo: item, icone: "check" } : item))} progresso={progresso} />
            </div>
          )}
        </>
      );
    case "codigo":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={64 * escala} progresso={progresso} />}
          <div style={{ marginTop: 40 * u }}>
            <JanelasCodigo brand={brand} u={u} janelas={slide.codigo ?? []} progresso={progresso} />
          </div>
          {slide.corpo && <div style={{ marginTop: 32 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={32} progresso={progresso} /></div>}
        </>
      );
    case "cta":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={92 * escala} progresso={progresso} maxCh={16} />}
          {slide.corpo && <div style={{ marginTop: 36 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} progresso={progresso} /></div>}
          {slide.botao && <div style={{ marginTop: 56 * u }}><Botao brand={brand} u={u} texto={slide.botao} p={p} /></div>}
        </>
      );
  }
}

function ConteudoHorizontal({ brand, slide, p, u, postId, progresso, capaLinkedin }: ConteudoProps & { capaLinkedin: boolean }) {
  const site = <span style={{ fontFamily: brand.fontes.display, fontSize: 34 * u, fontWeight: 500, color: p.rotulo }}>{brand.site}</span>;
  const extra = slide.layout === "print" ? (
    <Tela brand={brand} u={u} p={p} postId={postId} imagem={slide.imagem} />
  ) : slide.botao ? (
    <Botao brand={brand} u={u * 1.2} texto={slide.botao} p={p} />
  ) : slide.fatos ? (
    <Fatos brand={brand} u={u * 1.3} p={p} fatos={slide.fatos} />
  ) : null;

  if (capaLinkedin) {
    return (
      <div style={{ marginLeft: "36%", display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", gap: 22 * u }}>
        {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={136} progresso={progresso} />}
        {slide.corpo && <Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={46} progresso={progresso} />}
        <div style={{ display: "flex", alignItems: "center", gap: 32 * u, marginTop: 8 * u }}>
          {slide.layout !== "print" && extra}
          {site}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 56 * u, alignItems: "center", height: "100%" }}>
      <div style={{ flex: 1.3, minWidth: 0 }}>
        {slide.rotulo && <Rotulo brand={brand} u={u * 1.2} p={p}>{slide.rotulo}</Rotulo>}
        {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={112} progresso={progresso} />}
        {slide.corpo && <div style={{ marginTop: 24 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={42} progresso={progresso} /></div>}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", gap: 24 * u, height: "100%" }}>
        {extra}
        {site}
      </div>
    </div>
  );
}
