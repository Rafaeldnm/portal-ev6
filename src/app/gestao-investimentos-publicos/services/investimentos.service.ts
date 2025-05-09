import { Injectable } from '@angular/core';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoriasService, Categoria } from './categorias.service';
import { IpcaService } from './ipca.service';

export interface Investimento {
  id: number;
  categoriaId: number;
  valor: number;
  ano: number;
  descricao: string;
  valorCorrigido?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvestimentosService {
  private investimentos: Investimento[] = [
    { id: 1, categoriaId: 1, valor: 100, ano: 2020, descricao: 'Investimento em equipamentos hospitalares' },
    { id: 2, categoriaId: 1, valor: 150, ano: 2021, descricao: 'Ampliação do centro cirúrgico' },
    { id: 3, categoriaId: 1, valor: 200, ano: 2022, descricao: 'Reforma da ala pediátrica' },
    { id: 4, categoriaId: 1, valor: 2000, ano: 2025, descricao: 'Construção de novo hospital' },
    { id: 5, categoriaId: 2, valor: 800, ano: 2020, descricao: 'Instalação de academias ao ar livre' },
    { id: 6, categoriaId: 3, valor: 300, ano: 2022, descricao: 'Manutenção de equipamentos HGL' },
    { id: 7, categoriaId: 3, valor: 500, ano: 2025, descricao: 'Modernização sistemas HGL' }
  ];

  constructor(
    private categoriasService: CategoriasService,
    private ipcaService: IpcaService
  ) { }

  private calcularValorCorrigido(investimento: Investimento, categoria: Categoria): Observable<number | undefined> {
    if (categoria.tipoValor === 'Financeiro') {
      return this.ipcaService.calcularValorCorrigido(investimento.valor, investimento.ano);
    }
    return of(undefined);
  }

  private atualizarInvestimentoComValorCorrigido(
    investimento: Investimento,
    categoria: Categoria
  ): Observable<Investimento> {
    return this.calcularValorCorrigido(investimento, categoria).pipe(
      map(valorCorrigido => ({ ...investimento, valorCorrigido }))
    );
  }

  listarInvestimentos(): Observable<Investimento[]> {
    return this.categoriasService.listarCategorias().pipe(
      switchMap(categorias => {
        const observables = this.investimentos.map(investimento => {
          const categoria = categorias.find(c => c.id === investimento.categoriaId);
          if (categoria) {
            return this.atualizarInvestimentoComValorCorrigido(investimento, categoria);
          }
          return of(investimento);
        });
        return combineLatest(observables);
      })
    );
  }

  obterInvestimento(id: number): Observable<Investimento | undefined> {
    const investimento = this.investimentos.find(inv => inv.id === id);
    if (!investimento) return of(undefined);

    return this.categoriasService.listarCategorias().pipe(
      switchMap(categorias => {
        const categoria = categorias.find(c => c.id === investimento.categoriaId);
        if (categoria) {
          return this.atualizarInvestimentoComValorCorrigido(investimento, categoria);
        }
        return of(investimento);
      })
    );
  }

  listarInvestimentosPorCategoria(categoriaId: number): Observable<Investimento[]> {
    const investimentosFiltrados = this.investimentos.filter(inv => inv.categoriaId === categoriaId);

    return this.categoriasService.listarCategorias().pipe(
      switchMap(categorias => {
        const categoria = categorias.find(c => c.id === categoriaId);
        if (!categoria) return of(investimentosFiltrados);

        const observables = investimentosFiltrados.map(investimento =>
          this.atualizarInvestimentoComValorCorrigido(investimento, categoria)
        );
        return combineLatest(observables);
      })
    );
  }

  adicionarInvestimento(investimento: Omit<Investimento, 'id'>): Observable<Investimento> {
    const novoInvestimento = {
      ...investimento,
      id: Math.max(...this.investimentos.map(i => i.id)) + 1
    };
    this.investimentos.push(novoInvestimento);

    return this.categoriasService.listarCategorias().pipe(
      switchMap(categorias => {
        const categoria = categorias.find(c => c.id === novoInvestimento.categoriaId);
        if (categoria) {
          return this.atualizarInvestimentoComValorCorrigido(novoInvestimento, categoria);
        }
        return of(novoInvestimento);
      })
    );
  }

  atualizarInvestimento(id: number, investimento: Partial<Investimento>): Observable<Investimento | undefined> {
    const index = this.investimentos.findIndex(i => i.id === id);
    if (index === -1) return of(undefined);

    this.investimentos[index] = { ...this.investimentos[index], ...investimento };
    const investimentoAtualizado = this.investimentos[index];

    return this.categoriasService.listarCategorias().pipe(
      switchMap(categorias => {
        const categoria = categorias.find(c => c.id === investimentoAtualizado.categoriaId);
        if (categoria) {
          return this.atualizarInvestimentoComValorCorrigido(investimentoAtualizado, categoria);
        }
        return of(investimentoAtualizado);
      })
    );
  }

  excluirInvestimento(id: number): Observable<boolean> {
    const index = this.investimentos.findIndex(i => i.id === id);
    if (index !== -1) {
      this.investimentos.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
