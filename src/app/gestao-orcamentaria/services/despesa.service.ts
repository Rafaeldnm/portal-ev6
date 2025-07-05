import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Despesa {
  id: number;
  orcamentoId: number;
  data: Date;
  descricao: string;
  valor: number;
  categoria: string;
  tipoDespesa: string;
  comprovante?: string;
}

@Injectable()
export class DespesaService {
  private despesas: Despesa[] = [
    {
      id: 1,
      orcamentoId: 1,
      data: new Date(2024, 0, 15),
      descricao: 'Reforma da Escola Municipal João da Silva',
      valor: 250000,
      categoria: 'Infraestrutura',
      tipoDespesa: 'Serviços'
    },
    {
      id: 2,
      orcamentoId: 1,
      data: new Date(2024, 1, 10),
      descricao: 'Reforma da Escola Municipal Maria Santos',
      valor: 250000,
      categoria: 'Infraestrutura',
      tipoDespesa: 'Serviços'
    },
    {
      id: 3,
      orcamentoId: 2,
      data: new Date(2024, 0, 20),
      descricao: 'Aquisição de 2 ambulâncias',
      valor: 200000,
      categoria: 'Equipamentos',
      tipoDespesa: 'Material'
    }
  ];

  constructor() { }

  getDespesas(): Observable<Despesa[]> {
    return of(this.despesas).pipe(delay(500));
  }

  getDespesasPorOrcamento(orcamentoId: number): Observable<Despesa[]> {
    const despesasFiltradas = this.despesas.filter(d => d.orcamentoId === orcamentoId);
    return of(despesasFiltradas).pipe(delay(500));
  }

  getDespesasPorCategoria(): Observable<{ categoria: string; total: number }[]> {
    const agrupamento = this.agruparPor('categoria');
    return of(agrupamento).pipe(delay(500));
  }

  addDespesa(despesa: Omit<Despesa, 'id'>): Observable<Despesa> {
    const novaDespesa: Despesa = {
      ...despesa,
      id: this.despesas.length + 1
    };
    this.despesas.push(novaDespesa);
    return of(novaDespesa).pipe(delay(500));
  }

  getResumoDespesas(): Observable<{
    totalDespesas: number;
    despesasPorCategoria: { categoria: string; total: number }[];
    despesasPorTipo: { tipo: string; total: number }[];
    ultimasDespesas: Despesa[];
  }> {
    const resumo = {
      totalDespesas: this.despesas.reduce((acc, curr) => acc + curr.valor, 0),
      despesasPorCategoria: this.agruparPor('categoria'),
      despesasPorTipo: this.agruparPorTipo(),
      ultimasDespesas: [...this.despesas]
        .sort((a, b) => b.data.getTime() - a.data.getTime())
        .slice(0, 5)
    };

    return of(resumo).pipe(delay(500));
  }

  private agruparPor(campo: 'categoria'): { categoria: string; total: number }[] {
    const agrupamento = this.despesas.reduce((acc, curr) => {
      const chave = curr[campo];
      if (!acc[chave]) {
        acc[chave] = 0;
      }
      acc[chave] += curr.valor;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(agrupamento).map(([categoria, total]) => ({
      categoria,
      total
    }));
  }

  private agruparPorTipo(): { tipo: string; total: number }[] {
    const agrupamento = this.despesas.reduce((acc, curr) => {
      const chave = curr.tipoDespesa;
      if (!acc[chave]) {
        acc[chave] = 0;
      }
      acc[chave] += curr.valor;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(agrupamento).map(([tipo, total]) => ({
      tipo,
      total
    }));
  }
}
