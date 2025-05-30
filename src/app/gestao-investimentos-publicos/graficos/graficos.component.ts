import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';
import { CategoriasService, Categoria } from '../services/categorias.service';
import { InvestimentosService, Investimento } from '../services/investimentos.service';
import { IpcaService } from '../services/ipca.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  private graficoBarras: Chart | null = null;
  categorias: Categoria[] = [];
  investimentos: Investimento[] = [];
  categoriaSelecionada: Categoria | null = null;

  // Paleta de cores
  private corPrincipal = '#ea580c'; // Laranja principal

  filtros = {
    categoriaId: 0,
    anoInicial: 2020,
    anoFinal: 2025,
    tipoValor: 'historico'
  };

  dadosGraficoBarras: ChartData = {
    labels: [],
    datasets: []
  };

  constructor(
    private categoriasService: CategoriasService,
    private investimentosService: InvestimentosService,
    private ipcaService: IpcaService
  ) { }

  ngOnInit(): void {
    this.categoriasService.listarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
        this.carregarInvestimentos();
      }
    );
  }

  carregarInvestimentos(): void {
    this.investimentosService.listarInvestimentos().pipe(
      switchMap(investimentos => {
        const atualizacoes = investimentos.map(investimento => {
          const categoria = this.categorias.find(c => c.Id === investimento.CategoriaId);
          if (categoria?.TipoValor === 'Financeiro') {
            return this.ipcaService.calcularValorCorrigido(investimento.Valor, investimento.Ano)
              .pipe(
                switchMap(valorCorrigido => {
                  investimento.ValorCorrigido = valorCorrigido;
                  return of(investimento);
                })
              );
          }
          return of(investimento);
        });

        return forkJoin(atualizacoes);
      })
    ).subscribe(investimentosAtualizados => {
      this.investimentos = investimentosAtualizados;
      this.atualizarGrafico();
    });
  }

  onCategoriaChange(categoriaId: number): void {
    this.categoriaSelecionada = this.categorias.find(c => c.Id === +categoriaId) || null;
    this.atualizarGrafico();
  }

  private atualizarGrafico(): void {
    if (!this.categoriaSelecionada) {
      this.dadosGraficoBarras = {
        labels: [],
        datasets: []
      };
      this.atualizarGraficoBarras();
      return;
    }

    // Filtra investimentos da categoria selecionada
    const investimentosFiltrados = this.investimentos.filter(
      inv => inv.CategoriaId === this.categoriaSelecionada?.Id
    );

    // Filtra por período
    const investimentosPeriodo = investimentosFiltrados.filter(
      inv => inv.Ano >= this.filtros.anoInicial && inv.Ano <= this.filtros.anoFinal
    );

    // Ordena por ano
    investimentosPeriodo.sort((a, b) => a.Ano - b.Ano);

    // Prepara dados para o gráfico
    const anos = investimentosPeriodo.map(inv => inv.Ano.toString());
    const valores = investimentosPeriodo.map(inv => {
      if (this.filtros.tipoValor === 'corrigido' &&
          this.categoriaSelecionada?.TipoValor === 'Financeiro' &&
          inv.ValorCorrigido !== undefined) {
        return inv.ValorCorrigido;
      }
      return inv.Valor;
    });

    this.dadosGraficoBarras = {
      labels: anos,
      datasets: [{
        label: this.categoriaSelecionada.Nome,
        data: valores,
        backgroundColor: this.corPrincipal
      }]
    };

    this.atualizarGraficoBarras();
  }

  private atualizarGraficoBarras(): void {
    if (this.graficoBarras) {
      this.graficoBarras.destroy();
    }

    const configBarras: ChartConfiguration = {
      type: 'bar',
      data: this.dadosGraficoBarras,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value: number | string) => {
                if (this.categoriaSelecionada) {
                  switch (this.categoriaSelecionada.TipoValor) {
                    case 'Financeiro':
                      return `R$ ${value}`;
                    case 'Percentual':
                      return `${value}%`;
                    default:
                      return value;
                  }
                }
                return value;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: '#4b5563',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const value = context.parsed.y;
                if (this.categoriaSelecionada) {
                  switch (this.categoriaSelecionada.TipoValor) {
                    case 'Financeiro':
                      return `R$ ${value}`;
                    case 'Percentual':
                      return `${value}%`;
                    default:
                      return value.toString();
                  }
                }
                return value.toString();
              }
            }
          }
        }
      }
    };

    const ctxBarras = document.getElementById('graficoBarras') as HTMLCanvasElement;
    if (ctxBarras) {
      this.graficoBarras = new Chart(ctxBarras, configBarras);
    }
  }

  exportarGrafico(): void {
    const canvas = document.getElementById('graficoBarras') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'investimentos-por-ano.png';
      link.href = url;
      link.click();
    }
  }

  onFiltroChange(): void {
    this.atualizarGrafico();
  }
}
