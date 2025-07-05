import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OrcamentoService } from '../services/orcamento.service';
import { DespesaService } from '../services/despesa.service';
import { RelatorioService, RelatorioGeral, ComparativoMensal } from '../services/relatorio.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  relatorioGeral$: Observable<RelatorioGeral>;
  comparativoAnual$: Observable<ComparativoMensal[]>;
  carregando = true;

  // Configurações do gráfico de status
  statusChartData = {
    labels: ['Em dia', 'Atrasado', 'Concluído'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4CAF50', '#FFC107', '#2196F3']
    }]
  };

  // Configurações do gráfico de comparativo anual
  comparativoChartData = {
    labels: [],
    datasets: [
      {
        label: 'Previsto',
        data: [],
        borderColor: '#2196F3',
        fill: false
      },
      {
        label: 'Realizado',
        data: [],
        borderColor: '#4CAF50',
        fill: false
      }
    ]
  };

  constructor(
    private orcamentoService: OrcamentoService,
    private despesaService: DespesaService,
    private relatorioService: RelatorioService
  ) {
    this.relatorioGeral$ = this.relatorioService.getRelatorioGeral();
    this.comparativoAnual$ = this.relatorioService.getComparativoAnual();
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    this.relatorioGeral$.subscribe(relatorio => {
      this.atualizarGraficoStatus(relatorio);
      this.carregando = false;
    });

    this.comparativoAnual$.subscribe(comparativo => {
      this.atualizarGraficoComparativo(comparativo);
    });
  }

  private atualizarGraficoStatus(relatorio: RelatorioGeral): void {
    this.statusChartData.datasets[0].data = [
      relatorio.orcamentosPorStatus.emDia,
      relatorio.orcamentosPorStatus.atrasado,
      relatorio.orcamentosPorStatus.concluido
    ];
  }

  private atualizarGraficoComparativo(comparativo: ComparativoMensal[]): void {
    // this.comparativoChartData.labels = comparativo.map(item => item.mes);
    // this.comparativoChartData.datasets[0].data = comparativo.map(item => item.previsto);
    // this.comparativoChartData.datasets[1].data = comparativo.map(item => item.realizado);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(valor / 100);
  }
}
