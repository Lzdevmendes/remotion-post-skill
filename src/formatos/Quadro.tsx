import { AbsoluteFill, useVideoConfig } from "remotion";
import type { Brand } from "../brand/tipos";
import { AreaSticker, Botao, Celular, Corpo, Fatos, Marca, paleta, Rotulo, Selo, SeloSerie, Tela, Titulo } from "../blocos";
import type { Post, Slide } from "../tipos-post";

type QuadroProps = {
  post: Post;
  brand: Brand;
  slide: Slide;
  indice: number;
  entrada?: number;
  progresso?: number;
};

export function Quadro({ post, brand, slide, indice, entrada = 1, progresso = 1 }: QuadroProps) {
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
  const ultimo = indice === total - 1;
  const deslocamento = (1 - entrada) * 40 * u;

  const conteudo = horizontal ? (
    <ConteudoHorizontal brand={brand} slide={slide} p={p} u={u} postId={post.id} progresso={progresso} capaLinkedin={capaLinkedin} />
  ) : (
    <ConteudoVertical brand={brand} slide={slide} p={p} u={u} postId={post.id} progresso={progresso} vertical={vertical} />
  );

  return (
    <AbsoluteFill style={{ background: p.fundo, color: p.texto, padding: `${margemVertical}px ${margemLateral}px`, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: capaLinkedin ? "flex-end" : "space-between", gap: 24 * u }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 * u }}>
          <Marca brand={brand} u={u * (horizontal ? 1.3 : 1)} cor={p.texto} />
          {post.serie && !horizontal && <SeloSerie brand={brand} u={u} p={p} nome={post.serie.nome} numero={post.serie.numero} />}
        </div>
        {slide.selo ? (
          <Selo brand={brand} u={u} texto={slide.selo.texto} tipo={slide.selo.tipo} />
        ) : ehCarrossel ? (
          <span style={{ fontFamily: brand.fontes.display, fontSize: 24 * u, fontWeight: 600, letterSpacing: "0.08em", color: p.rotulo, fontVariantNumeric: "tabular-nums" }}>
            {String(indice + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
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
          opacity: entrada,
          transform: `translateY(${deslocamento}px)`,
        }}
      >
        {conteudo}
        {slide.sticker && !horizontal && (
          <div style={{ marginTop: 40 * u }}>
            <AreaSticker brand={brand} u={u} p={p} dica={slide.sticker.dica} />
          </div>
        )}
      </div>

      {!horizontal && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `${Math.max(1, 2 * u)}px solid ${p.linha}`,
            paddingTop: 26 * u,
            fontFamily: brand.fontes.display,
            fontSize: 24 * u,
            fontWeight: 500,
            color: p.rotulo,
          }}
        >
          <span>{brand.site}</span>
          <span>{ehCarrossel && !ultimo ? "arraste →" : brand.handle}</span>
        </div>
      )}
    </AbsoluteFill>
  );
}

type ConteudoProps = { brand: Brand; slide: Slide; p: ReturnType<typeof paleta>; u: number; postId: string; progresso: number };

function ConteudoVertical({ brand, slide, p, u, postId, progresso, vertical }: ConteudoProps & { vertical: boolean }) {
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
    case "lista":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={68 * escala} progresso={progresso} />}
          <div style={{ marginTop: 44 * u }}>
            {(slide.itens ?? []).map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 28 * u, alignItems: "baseline", padding: `${24 * u}px 0`, borderTop: `${Math.max(1, 2 * u)}px solid ${p.linha}` }}>
                <span style={{ fontFamily: brand.fontes.display, fontWeight: 700, fontSize: 30 * u, color: p.escuro ? brand.cores.rotuloSobreEscuro : brand.cores.medio, fontVariantNumeric: "tabular-nums", flex: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Corpo brand={brand} u={u} p={{ ...p, suave: p.texto }} texto={item} tamanho={36} progresso={progresso} />
              </div>
            ))}
          </div>
        </>
      );
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
              <Celular key={i} brand={brand} u={u} tela={tela} />
            ))}
          </div>
          {slide.corpo && <div style={{ marginTop: 40 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} tamanho={34} progresso={progresso} /></div>}
        </>
      );
    case "cta":
      return (
        <>
          {slide.rotulo && <Rotulo brand={brand} u={u} p={p}>{slide.rotulo}</Rotulo>}
          {slide.titulo && <Titulo brand={brand} u={u} p={p} texto={slide.titulo} tamanho={92 * escala} progresso={progresso} maxCh={16} />}
          {slide.corpo && <div style={{ marginTop: 36 * u }}><Corpo brand={brand} u={u} p={p} texto={slide.corpo} progresso={progresso} /></div>}
          {slide.botao && <div style={{ marginTop: 56 * u }}><Botao brand={brand} u={u} texto={slide.botao} /></div>}
        </>
      );
  }
}

function ConteudoHorizontal({ brand, slide, p, u, postId, progresso, capaLinkedin }: ConteudoProps & { capaLinkedin: boolean }) {
  const site = <span style={{ fontFamily: brand.fontes.display, fontSize: 34 * u, fontWeight: 500, color: p.rotulo }}>{brand.site}</span>;
  const extra = slide.layout === "print" ? (
    <Tela brand={brand} u={u} p={p} postId={postId} imagem={slide.imagem} />
  ) : slide.botao ? (
    <Botao brand={brand} u={u * 1.2} texto={slide.botao} />
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
