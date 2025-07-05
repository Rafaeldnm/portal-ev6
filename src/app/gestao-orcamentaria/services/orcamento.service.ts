import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Orcamento {
  id: number;
  ano: number;
  secretaria: string;
  categoria: string;
  projeto: string;
  valorPrevisto: number;
  valorRealizado: number;
  status: 'Em dia' | 'Atrasado' | 'Concluído';
}

@Injectable()
export class OrcamentoService {
  private orcamentos: Orcamento[] = [
    {
      id: 1,
      ano: 2024,
      secretaria: 'Secretaria de Educação',
      categoria: 'Infraestrutura',
      projeto: 'Reforma de Escolas',
      valorPrevisto: 1500000,
      valorRealizado: 500000,
      status: 'Em dia'
    },
    {
      id: 2,
      ano: 2024,
      secretaria: 'Secretaria de Saúde',
      categoria: 'Equipamentos',
      projeto: 'Aquisição de Ambulâncias',
      valorPrevisto: 800000,
      valorRealizado: 200000,
      status: 'Atrasado'
    },
    {
      id: 3,
      ano: 2024,
      secretaria: 'Secretaria de Obras',
      categoria: 'Infraestrutura',
      projeto: 'Pavimentação de Vias',
      valorPrevisto: 2000000,
      valorRealizado: 2000000,
      status: 'Concluído'
    }
  ];

  constructor() { }

  getOrcamentos(): Observable<Orcamento[]> {
    return of(this.orcamentos).pipe(delay(500));
  }

  getOrcamento(id: number): Observable<Orcamento | undefined> {
    const orcamento = this.orcamentos.find(o => o.id === id);
    return of(orcamento).pipe(delay(500));
  }

  addOrcamento(orcamento: Omit<Orcamento, 'id' | 'valorRealizado' | 'status'>): Observable<Orcamento> {
    const novoOrcamento: Orcamento = {
      ...orcamento,
      id: this.orcamentos.length + 1,
      valorRealizado: 0,
      status: 'Em dia'
    };
    this.orcamentos.push(novoOrcamento);
    return of(novoOrcamento).pipe(delay(500));
  }

  getResumoOrcamentario(): Observable<{
    totalPrevisto: number;
    totalRealizado: number;
    percentualExecutado: number;
    quantidadeEmDia: number;
    quantidadeAtrasado: number;
    quantidadeConcluido: number;
  }> {
    const resumo = {
      totalPrevisto: this.orcamentos.reduce((acc, curr) => acc + curr.valorPrevisto, 0),
      totalRealizado: this.orcamentos.reduce((acc, curr) => acc + curr.valorRealizado, 0),
      percentualExecutado: 0,
      quantidadeEmDia: this.orcamentos.filter(o => o.status === 'Em dia').length,
      quantidadeAtrasado: this.orcamentos.filter(o => o.status === 'Atrasado').length,
      quantidadeConcluido: this.orcamentos.filter(o => o.status === 'Concluído').length
    };

    resumo.percentualExecutado = (resumo.totalRealizado / resumo.totalPrevisto) * 100;

    return of(resumo).pipe(delay(500));
  }
}
