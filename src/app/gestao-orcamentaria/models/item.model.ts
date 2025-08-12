export interface Item {
  Id: number;
  Descricao: string;
  TipoGasto: 'Obrigatório' | 'Importante' | 'Outros';
  Classificacao: 'Midia' | 'Outros';
  Historico: string;
  Fornecedor: string;
  Fonte: string;
  Valor: {
    Total: number;
    PeriodosAnteriores: number;
    Janeiro: number;
    Fevereiro: number;
    Marco: number;
    Abril: number;
    Maio: number;
    Junho: number;
    Julho: number;
    Agosto: number;
    Setembro: number;
    Outubro: number;
    Novembro: number;
    Dezembro: number;
  };
}
