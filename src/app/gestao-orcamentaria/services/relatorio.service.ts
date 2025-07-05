import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { OrcamentoService } from './orcamento.service';
import { DespesaService } from './despesa.service';

export interface RelatorioGeral {
  totalOrcado: number;
  totalRealizado: number;
  percentualExecutado: number;
  quantidadeOrcamentos: number;
  quantidadeDespesas: number;
  orcamentosPorStatus: {
    emDia: number;
    atrasado: number;
    concluido: number;
  };
  despesasPorCategoria: {
    categoria: string;
    total: number;
    percentual: number;
  }[];
  despesasPorTipo: {
    tipo: string;
    total: number;
    percentual: number;
  }[];
}

export interface ComparativoMensal {
  mes: string;
  previsto: number;
  realizado: number;
}

@Injectable()
export class RelatorioService {
  constructor(
    private orcamentoService: OrcamentoService,
    private despesaService: DespesaService
  ) {}

  getRelatorioGeral(): Observable<RelatorioGeral> {
    return combineLatest([
      this.orcamentoService.getResumoOrcamentario(),
      this.despesaService.getResumoDespesas()
    ]).pipe(
      map(([resumoOrcamento, resumoDespesas]) => {
        const relatorio: RelatorioGeral = {
          totalOrcado: resumoOrcamento.totalPrevisto,
          totalRealizado: resumoDespesas.totalDespesas,
          percentualExecutado: (resumoDespesas.totalDespesas / resumoOrcamento.totalPrevisto) * 100,
          quantidadeOrcamentos:
            resumoOrcamento.quantidadeEmDia +
            resumoOrcamento.quantidadeAtrasado +
            resumoOrcamento.quantidadeConcluido,
          quantidadeDespesas: resumoDespesas.ultimasDespesas.length,
          orcamentosPorStatus: {
            emDia: resumoOrcamento.quantidadeEmDia,
            atrasado: resumoOrcamento.quantidadeAtrasado,
            concluido: resumoOrcamento.quantidadeConcluido
          },
          despesasPorCategoria: resumoDespesas.despesasPorCategoria.map(d => ({
            categoria: d.categoria,
            total: d.total,
            percentual: (d.total / resumoDespesas.totalDespesas) * 100
          })),
          despesasPorTipo: resumoDespesas.despesasPorTipo.map(d => ({
            tipo: d.tipo,
            total: d.total,
            percentual: (d.total / resumoDespesas.totalDespesas) * 100
          }))
        };

        return relatorio;
      })
    );
  }

  getComparativoAnual(): Observable<ComparativoMensal[]> {
    // Dados mockados para demonstração
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const comparativo = meses.map((mes, index) => ({
      mes,
      previsto: 1000000 + (Math.random() * 500000),
      realizado: 800000 + (Math.random() * 400000)
    }));

    return of(comparativo).pipe(delay(500));
  }

  exportarRelatorio(): Observable<string> {
    // Simulação de exportação de relatório
    return this.getRelatorioGeral().pipe(
      map(relatorio => {
        const dataStr = JSON.stringify(relatorio, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        return URL.createObjectURL(blob);
      })
    );
  }
}
