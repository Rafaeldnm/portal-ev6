import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
  tipoValor: 'Financeiro' | 'Percentual' | 'Numero';
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private categorias: Categoria[] = [
    { id: 1, nome: 'Saúde', descricao: 'Investimentos em saúde pública', tipoValor: 'Financeiro' },
    { id: 2, nome: 'Academia', descricao: 'Investimentos em academias ao ar livre', tipoValor: 'Financeiro' },
    { id: 3, nome: 'Custo HGL', descricao: 'Custos hospitalares gerais', tipoValor: 'Financeiro' }
  ];

  constructor() { }

  listarCategorias(): Observable<Categoria[]> {
    return of(this.categorias);
  }

  adicionarCategoria(categoria: Omit<Categoria, 'id'>): Observable<Categoria> {
    const novaCategoria = {
      ...categoria,
      id: Math.max(...this.categorias.map(c => c.id)) + 1
    };
    this.categorias.push(novaCategoria);
    return of(novaCategoria);
  }

  atualizarCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria | undefined> {
    const index = this.categorias.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categorias[index] = { ...this.categorias[index], ...categoria };
      return of(this.categorias[index]);
    }
    return of(undefined);
  }

  excluirCategoria(id: number): Observable<boolean> {
    const index = this.categorias.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categorias.splice(index, 1);
      return of(true);
    }
    return of(false);
  }
}
