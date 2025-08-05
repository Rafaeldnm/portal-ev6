export interface AtualizarAtividadeRequest {
  id: number;
  nomeAtividade: string;
  descricao: string;
  ficha: string;
  orcamentoInicial: number;
  orcamentoAtualizado: number;
  previsaoGastosAno: number;
  diferencaPrevista: number;
  classificacao: string;
  historico: string;
  fornecedor: string;
  gastoTotalAno: number;
  elementos: ElementoSubGridDto[];
}

export interface ElementoSubGridDto {
  titulo: string;
  descricao: string;
  ficha: string;
  recurso: string;
  orcamentoInicial: number;
  orcamentoAtualizado: number;
  previsaoGastosAno: number;
  diferencaPrevistaAno: number;
  itens: ItemDto[];
}

export interface ItemDto {
  descricao: string;
  tipoGasto: string;
  classificacao: string;
  historico: string;
  fornecedor: string;
  fonte: string;
  valor: ValorDto;
}

export interface ValorDto {
  total: number;
  periodosAnteriores: number;
  janeiro: number;
  fevereiro: number;
  marco: number;
  abril: number;
  maio: number;
  junho: number;
  julho: number;
  agosto: number;
  setembro: number;
  outubro: number;
  novembro: number;
  dezembro: number;
}
