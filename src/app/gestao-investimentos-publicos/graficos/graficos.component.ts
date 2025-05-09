import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js/auto';
import { CategoriasService, Categoria } from '../services/categorias.service';
import { InvestimentosService, Investimento } from '../services/investimentos.service';

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
    private investimentosService: InvestimentosService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarInvestimentos();
  }

  carregarCategorias(): void {
    this.categoriasService.listarCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  carregarInvestimentos(): void {
    this.investimentosService.listarInvestimentos().subscribe(investimentos => {
      this.investimentos = investimentos;
      this.atualizarGrafico();
    });
  }

  onCategoriaChange(categoriaId: number): void {
    this.categoriaSelecionada = this.categorias.find(c => c.id === +categoriaId) || null;
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
      inv => inv.categoriaId === this.categoriaSelecionada?.id
    );

    // Filtra por período
    const investimentosPeriodo = investimentosFiltrados.filter(
      inv => inv.ano >= this.filtros.anoInicial && inv.ano <= this.filtros.anoFinal
    );

    // Ordena por ano
    investimentosPeriodo.sort((a, b) => a.ano - b.ano);

    // Prepara dados para o gráfico
    const anos = investimentosPeriodo.map(inv => inv.ano.toString());
    const valores = investimentosPeriodo.map(inv => {
      if (this.filtros.tipoValor === 'corrigido' &&
          this.categoriaSelecionada?.tipoValor === 'Financeiro' &&
          inv.valorCorrigido !== undefined) {
        return inv.valorCorrigido;
      }
      return inv.valor;
    });

    this.dadosGraficoBarras = {
      labels: anos,
      datasets: [{
        label: this.categoriaSelecionada.nome,
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
                  switch (this.categoriaSelecionada.tipoValor) {
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
                  switch (this.categoriaSelecionada.tipoValor) {
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
