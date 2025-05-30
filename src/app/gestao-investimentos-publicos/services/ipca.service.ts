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
  // API do BCB para IPCA mensal (código 433)
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
        // Filtra somente o mês de dezembro (mês 11), que representa o acumulado anual do IPCA
        response.forEach(item => {
          const data = new Date(item.data);
          const ano = data.getFullYear();
          const mes = data.getMonth();
          if (mes === 11) { // dezembro
            cache[ano] = parseFloat(item.valor);
          }
        });
        this.ipcaCache = cache;
        return cache;
      }),
      catchError(() => {
        // Em caso de erro, usar dados mockados (dados anuais para dezembro)
        const mockData: { [ano: number]: number } = {
          1980: 110.21,
          1981: 95.99,
          1982: 99.71,
          1983: 211.03,
          1984: 223.90,
          1985: 235.07,
          1986: 65.01,
          1987: 415.87,
          1988: 1037.56,
          1989: 1782.90,
          1990: 1620.97,
          1991: 472.70,
          1992: 1119.10,
          1993: 2477.15,
          1994: 916.46,
          1995: 22.41,
          1996: 9.56,
          1997: 5.22,
          1998: 1.65,
          1999: 8.94,
          2000: 6.00,
          2001: 7.67,
          2002: 12.53,
          2003: 9.30,
          2004: 7.60,
          2005: 5.69,
          2006: 3.14,
          2007: 4.46,
          2008: 5.90,
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

  calcularValorCorrigido(valor: number, anoInicial: number, anoFinal?: number): Observable<number> {
    const anoAtual = new Date().getFullYear();
    // Se o ano final não for passado, usar o ano atual menos 1 (último ano completo)
    const anoParaCorrigir = anoFinal && anoFinal <= anoAtual ? anoFinal : anoAtual - 1;
    const cacheKey = `${anoInicial}-${anoParaCorrigir}`;

    if (this.ipcaAcumuladoCache[cacheKey] !== undefined) {
      return of(valor * (1 + this.ipcaAcumuladoCache[cacheKey] / 100));
    }

    return this.carregarIpcaAnual().pipe(
      map(ipcaData => {
        let valorCorrigido = valor;

        for (let ano = anoInicial; ano <= anoParaCorrigir; ano++) {
          if (ipcaData[ano]) {
            valorCorrigido *= (1 + ipcaData[ano] / 100);
          }
        }

        const percentualAcumulado = ((valorCorrigido / valor) - 1) * 100;
        this.ipcaAcumuladoCache[cacheKey] = percentualAcumulado;

        return valorCorrigido;
      })
    );
  }

}
