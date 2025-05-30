import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Categoria {
  Id: number;
  Nome: string;
  Descricao: string;
  TipoValor: 'Financeiro' | 'Percentual' | 'Numero';
  DataCriacao: Date;
  DataAtualizacao?: Date;
}

export interface CategoriaInserirRequest {
  Nome: string;
  Descricao: string;
  TipoValor: 'Financeiro' | 'Percentual' | 'Numero';
}

export interface CategoriaUpdate {
  Nome?: string;
  Descricao?: string;
  TipoValor?: 'Financeiro' | 'Percentual' | 'Numero';
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private apiUrl = `${environment.apiUrl}/gestao-investimentos/categorias`;

  constructor(private http: HttpClient) { }

  listarCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl)
      .pipe(
        catchError(error => {
          console.error('Erro ao listar categorias:', error);
          return throwError(() => new Error('Erro ao carregar categorias. Por favor, tente novamente.'));
        })
      );
  }

  adicionarCategoria(request: CategoriaInserirRequest): Observable<Categoria> {
    // Enviar o objeto dentro de categoriaDto para atender a validação do backend
    return this.http.post<Categoria>(this.apiUrl, request)
      .pipe(
        catchError(error => {
          console.error('Erro ao adicionar categoria:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao adicionar categoria. Por favor, tente novamente.'));
        })
      );
  }

  atualizarCategoria(id: number, categoria: CategoriaUpdate): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar categoria:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao atualizar categoria. Por favor, tente novamente.'));
        })
      );
  }

  excluirCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Erro ao excluir categoria:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao excluir categoria. Por favor, tente novamente.'));
        })
      );
  }
}
