import { Item } from './item.model';

export interface ElementoSubGrid {
  Titulo: string;
  Descricao: string;
  Ficha: string;
  Recurso: string;
  OrcamentoInicial: number;
  OrcamentoAtualizado: number;
  PrevisaoGastosAno: number;
  DiferencaPrevistaAno: number;
  Itens: Item[];
}
