import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade } from '../models/atividade.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtividadesService {

  private apiUrl = `${environment.apiUrl}/Atividades`;

  constructor(private http: HttpClient) { }

  listarAtividades(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.apiUrl);
  }

  recuperarAtividade(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.apiUrl}/${id}`);
  }

  addAtividade(atividade: Atividade): Observable<Atividade> {
    return this.http.post<Atividade>(this.apiUrl, atividade);
  }

  editarAtividade(id: number, atividade: Atividade): Observable<Atividade> {
    return this.http.put<Atividade>(`${this.apiUrl}/${id}`, atividade);
  }

  removeAtividade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

// import { Injectable } from '@angular/core';
// import { Atividade } from '../models/atividade.model';

// const STORAGE_KEY = 'atividades';

// @Injectable({
//   providedIn: 'root'
// })
// export class AtividadesService {

//   constructor() { }

//   getAtividades(): Atividade[] {
//     const data = localStorage.getItem(STORAGE_KEY);
//     if (data) {
//       return JSON.parse(data) as Atividade[];
//     }
//     return [];
//   }

//   saveAtividades(atividades: Atividade[]): void {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(atividades));
//   }

//   addAtividade(atividade: Atividade): void {
//     const atividades = this.getAtividades();
//     atividades.push(atividade);
//     this.saveAtividades(atividades);
//   }

//   updateAtividade(updatedAtividade: Atividade): void {
//     const atividades = this.getAtividades();
//     const index = atividades.findIndex(a => a.id === updatedAtividade.id);
//     if (index !== -1) {
//       atividades[index] = updatedAtividade;
//       this.saveAtividades(atividades);
//     }
//   }

//   removeAtividade(id: number): void {
//     let atividades = this.getAtividades();
//     atividades = atividades.filter(a => a.id !== id);
//     this.saveAtividades(atividades);
//   }
// }
