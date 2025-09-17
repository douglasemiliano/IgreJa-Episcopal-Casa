export class Texto {
    livro: string; // Nome completo do livro (ex.: "Isaías")
    abreviacao: string; // Abreviação do livro (ex.: "Is")
    capitulo: number; // Número do capítulo
    versiculos: number[]; // Lista de versículos
  
    constructor(livro: string, abreviacao: string, capitulo: number, versiculos: number[]) {
      this.livro = livro;
      this.abreviacao = abreviacao;
      this.capitulo = capitulo;
      this.versiculos = versiculos;
    }
  }
  
  export  interface Leitura {
    primeira: string;
    interlecional: string;
    segunda: string;
    evangelho: string;
  }
  
  export  interface Lecionario {
    ano: string;
    conteudo: Conteudo[];
  
  }
  
  export  interface Conteudo {
    dia: string; // formato ISO: YYYY-MM-DD
    nome: string;
    oracoes: string[];
    leituras: any[];
    tempo?: string;
  }

  export interface LecionarioResponse {
        id: string;
        created_at: string;
        dia: string;
        leituras: string[];
        nome: string;
        oracoes: string[];
        tempo: string;
        ano_liturgico: string;
  }
  