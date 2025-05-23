import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegistroUsuario {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private apiUrl = `${environment.apiUrl}/autenticacao`;

  constructor(private http: HttpClient) { }

  login(email: string, senha: string): Observable<User> {
    const loginData: LoginRequest = { email, senha };

    return this.http.post<User>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          this.currentUser = response;
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          localStorage.setItem('user', JSON.stringify(response));
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao realizar login'));
        })
      );
  }

  registro(dados: RegistroUsuario): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/registro`, dados)
      .pipe(
        tap(response => {
          this.currentUser = response;
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          localStorage.setItem('user', JSON.stringify(response));
        }),
        catchError(error => {
          console.error('Erro no registro:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao realizar registro'));
        })
      );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  obterUsuarioAtual(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/usuario-atual`)
      .pipe(
        tap(user => {
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Erro ao obter usuário atual:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao obter usuário'));
        })
      );
  }
}
