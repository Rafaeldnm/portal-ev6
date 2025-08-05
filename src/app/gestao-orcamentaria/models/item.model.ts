export interface Item {
  descricao: string;
  tipoGasto: 'Obrigatório' | 'Importante' | 'Outros';
  classificacao: 'Midia' | 'Outros';
  historico: string;
  fornecedor: string;
  fonte: string;
  valor: {
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
  };
}
