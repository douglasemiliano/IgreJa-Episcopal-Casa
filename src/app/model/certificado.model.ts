export interface DadosCertificado {
  nomeCompleto: string;
  dataConfirmacao: Date;
  igreja: string;
  diocese: string;
  paroco: string;
  bispo: string;
  numeroRegistro?: string;
  padrinhos?: string[];
  localCelebracao?: string;
  dataNascimento?: Date;
  nomePais?: string;
  naturalidade?: string;
  dataBatismo?: Date;
  igrejaBatismo?: string;
  livroRegistro?: string;
  paginaRegistro?: string;
}