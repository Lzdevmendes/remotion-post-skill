export type FonteArquivo = {
  family: string;
  arquivo: string;
  weight: string;
  style: "normal" | "italic";
  unicodeRange?: string;
};

export type Brand = {
  id: string;
  nome: string;
  site: string;
  handle: string;
  marca: { texto: string; ponto: string };
  cores: {
    fundoEscuro: string;
    superficieEscura: string;
    medio: string;
    fundoClaro: string;
    superficieClara: string;
    linha: string;
    linhaSobreEscuro: string;
    neutro: string;
    rotuloSobreEscuro: string;
    ledeSobreEscuro: string;
    acento: string;
    acentoFundo: string;
    acentoTexto: string;
    telaGradiente: string;
    telaTexto: string;
  };
  fontes: { display: string; texto: string; mono: string };
  arquivosFonte: FonteArquivo[];
  googleFonts?: string[];
  raio: number;
  rotuloTracking: string;
  tituloTracking: string;
  maxAcentosPorArte: number;
};
