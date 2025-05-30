import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Investimento {
  Id: number;
  CategoriaId: number;
  Valor: number;
  Ano: number;
  Descricao: string;
  ValorCorrigido?: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvestimentosService {
  private apiUrl = `${environment.apiUrl}/gestao-investimentos/investimentos`;

  constructor(private http: HttpClient) { }

  listarInvestimentos(): Observable<Investimento[]> {
    return this.http.get<Investimento[]>(this.apiUrl);
  }

  obterInvestimento(id: number): Observable<Investimento> {
    return this.http.get<Investimento>(`${this.apiUrl}/${id}`);
  }

  listarInvestimentosPorCategoria(categoriaId: number): Observable<Investimento[]> {
    return this.http.get<Investimento[]>(`${this.apiUrl}/categoria/${categoriaId}`);
  }

  adicionarInvestimento(investimento: Omit<Investimento, 'Id'>): Observable<Investimento> {
    return this.http.post<Investimento>(this.apiUrl, investimento);
  }

  atualizarInvestimento(id: number, investimento: Partial<Investimento>): Observable<Investimento> {
    return this.http.put<Investimento>(`${this.apiUrl}/${id}`, investimento);
  }

  excluirInvestimento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
