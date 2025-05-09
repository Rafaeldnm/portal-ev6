import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { InvestimentosService, Investimento } from './investimentos.service';
import { CategoriasService, Categoria } from './categorias.service';

export interface DatasetGrafico {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface DadosGrafico {
  labels: string[];
  datasets: DatasetGrafico[];
}

export interface FiltrosGrafico {
  categoria?: string;
  anoInicial?: number;
  anoFinal?: number;
  tipoValor: 'historico' | 'corrigido';
}

@Injectable({
  providedIn: 'root'
})
export class GraficosService {
  private paletaCores = [
    '#ea580c', // Laranja principal
    '#64748b', // Cinza azulado
    '#475569', // Cinza escuro
    '#f97316', // Laranja mais vivo
    '#cbd5e1'  // Cinza claro
  ];

  constructor(
    private investimentosService: InvestimentosService,
    private categoriasService: CategoriasService
  ) { }

  obterDadosGraficoBarras(filtros: FiltrosGrafico): Observable<DadosGrafico> {
    return combineLatest([
      this.categoriasService.listarCategorias(),
      this.investimentosService.listarInvestimentos()
    ]).pipe(
      map(([categorias, investimentos]) => {
        const anos = this.obterAnosDisponiveis(investimentos, filtros);
        const categoriasFiltradas = filtros.categoria ?
          categorias.filter(c => c.nome.toLowerCase() === filtros.categoria?.toLowerCase()) :
          categorias;

        return {
          labels: anos.map(ano => ano.toString()),
          datasets: categoriasFiltradas.map((categoria, index) => ({
            label: categoria.nome,
            data: anos.map(ano => this.calcularValorPorCategoriaEAno(
              investimentos,
              categoria.id,
              ano,
              filtros.tipoValor
            )),
            backgroundColor: this.paletaCores[index % this.paletaCores.length]
          }))
        };
      })
    );
  }

  obterDadosGraficoPizza(filtros: FiltrosGrafico): Observable<DadosGrafico> {
    return combineLatest([
      this.categoriasService.listarCategorias(),
      this.investimentosService.listarInvestimentos()
    ]).pipe(
      map(([categorias, investimentos]) => {
        const categoriasFiltradas = filtros.categoria ?
          categorias.filter(c => c.nome.toLowerCase() === filtros.categoria?.toLowerCase()) :
          categorias;

        const totaisPorCategoria = categoriasFiltradas.map(categoria => ({
          categoria: categoria.nome,
          total: this.calcularTotalPorCategoria(
            investimentos,
            categoria.id,
            filtros
          )
        }));

        return {
          labels: totaisPorCategoria.map(t => t.categoria),
          datasets: [{
            label: 'Total por Categoria',
            data: totaisPorCategoria.map(t => t.total),
            backgroundColor: this.paletaCores[0]
          }]
        };
      })
    );
  }

  private obterAnosDisponiveis(investimentos: Investimento[], filtros: FiltrosGrafico): number[] {
    const anos = [...new Set(investimentos.map(i => i.ano))].sort();
    return anos.filter(ano =>
      (!filtros.anoInicial || ano >= filtros.anoInicial) &&
      (!filtros.anoFinal || ano <= filtros.anoFinal)
    );
  }

  private calcularValorPorCategoriaEAno(
    investimentos: Investimento[],
    categoriaId: number,
    ano: number,
    tipoValor: 'historico' | 'corrigido'
  ): number {
    return investimentos
      .filter(i => i.categoriaId === categoriaId && i.ano === ano)
      .reduce((total, inv) => total + (
        tipoValor === 'corrigido' && inv.valorCorrigido ?
        inv.valorCorrigido :
        inv.valor
      ), 0);
  }

  private calcularTotalPorCategoria(
    investimentos: Investimento[],
    categoriaId: number,
    filtros: FiltrosGrafico
  ): number {
    return investimentos
      .filter(i =>
        i.categoriaId === categoriaId &&
        (!filtros.anoInicial || i.ano >= filtros.anoInicial) &&
        (!filtros.anoFinal || i.ano <= filtros.anoFinal)
      )
      .reduce((total, inv) => total + (
        filtros.tipoValor === 'corrigido' && inv.valorCorrigido ?
        inv.valorCorrigido :
        inv.valor
      ), 0);
  }
}
