import { ElementoSubGrid } from './elemento-sub-grid.model';

export interface Atividade {
  Id: number;
  NomeAtividade: string;
  Descricao: string;
  Ficha: string;
  OrcamentoInicial: number;
  OrcamentoAtualizado: number;
  PrevisaoGastosAno: number;
  DiferencaPrevista: number;
  Classificacao: 'Midia' | 'Obrigatorio';
  Historico: string;
  Fornecedor: string;
  GastoTotalAno: number;
  Elementos: ElementoSubGrid[];
}
