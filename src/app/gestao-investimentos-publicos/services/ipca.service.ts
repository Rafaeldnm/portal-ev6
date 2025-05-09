import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

interface BCBResponse {
  data: string;
  valor: string;
}

@Injectable({
  providedIn: 'root'
})
export class IpcaService {
  // API do BCB para IPCA anual (código 433)
  private readonly BCB_API = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados';

  private ipcaCache: { [ano: number]: number } = {};
  private ipcaAcumuladoCache: { [key: string]: number } = {};

  constructor(private http: HttpClient) { }

  private carregarIpcaAnual(): Observable<{ [ano: number]: number }> {
    if (Object.keys(this.ipcaCache).length > 0) {
      return of(this.ipcaCache);
    }

    return this.http.get<BCBResponse[]>(this.BCB_API).pipe(
      map(response => {
        const cache: { [ano: number]: number } = {};
        response.forEach(item => {
          const ano = new Date(item.data).getFullYear();
          cache[ano] = parseFloat(item.valor);
        });
        this.ipcaCache = cache;
        return cache;
      }),
      catchError(() => {
        // Em caso de erro, usar dados mockados
        const mockData: { [ano: number]: number } = {
          2009: 4.31,
          2010: 5.91,
          2011: 6.50,
          2012: 5.84,
          2013: 5.91,
          2014: 6.41,
          2015: 10.67,
          2016: 6.29,
          2017: 2.95,
          2018: 3.75,
          2019: 4.31,
          2020: 4.52,
          2021: 10.06,
          2022: 5.79,
          2023: 4.62,
          2024: 3.87, // Projeção
          2025: 3.50  // Projeção
        };
        this.ipcaCache = mockData;
        return of(mockData);
      })
    );
  }

  calcularValorCorrigido(valor: number, anoInicial: number): Observable<number> {
    const anoAtual = new Date().getFullYear();
    const cacheKey = `${anoInicial}-${anoAtual}`;

    if (this.ipcaAcumuladoCache[cacheKey] !== undefined) {
      return of(valor * (1 + this.ipcaAcumuladoCache[cacheKey] / 100));
    }

    return this.carregarIpcaAnual().pipe(
      map(ipcaData => {
        let valorCorrigido = valor;

        // Para cada ano entre o inicial e o atual, aplicamos o IPCA
        for (let ano = anoInicial; ano <= anoAtual; ano++) {
          if (ipcaData[ano]) {
            // Aplicamos o IPCA do ano ao valor
            valorCorrigido = valorCorrigido * (1 + ipcaData[ano] / 100);
          }
        }

        // Para anos futuros (após o ano atual), usamos projeções
        if (anoAtual < 2025) {
          for (let ano = anoAtual + 1; ano <= 2025; ano++) {
            if (ipcaData[ano]) {
              valorCorrigido = valorCorrigido * (1 + ipcaData[ano] / 100);
            }
          }
        }

        // Armazenamos o percentual acumulado no cache
        const percentualAcumulado = ((valorCorrigido / valor) - 1) * 100;
        this.ipcaAcumuladoCache[cacheKey] = percentualAcumulado;

        return valorCorrigido;
      })
    );
  }
}
