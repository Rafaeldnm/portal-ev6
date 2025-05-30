import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
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

export interface AtualizarPerfilRequestDto {
  nome: string;
}

export interface AtualizarSenhaRequestDto {
  senhaAtual: string;
  novaSenha: string;
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

    return this.http.post<{Id: number; Nome: string; Email: string; Perfil: string; Token: string}>(`${this.apiUrl}/login`, loginData)
      .pipe(
        map(response => {
          const user: User = {
            id: response.Id,
            nome: response.Nome,
            email: response.Email,
            perfil: response.Perfil,
            token: response.Token
          };
          this.currentUser = user;
          if (user.token) {
            localStorage.setItem('token', user.token);
          }
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        }),
        catchError(error => {
          console.error('Erro no login:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao realizar login'));
        })
      );
  }

  registro(dados: RegistroUsuario): Observable<User> {
    return this.http.post<{Id: number; Nome: string; Email: string; Perfil: string; Token: string}>(`${this.apiUrl}/registro`, dados)
      .pipe(
        map(response => {
          const user: User = {
            id: response.Id,
            nome: response.Nome,
            email: response.Email,
            perfil: response.Perfil,
            token: response.Token
          };
          this.currentUser = user;
          if (user.token) {
            localStorage.setItem('token', user.token);
          }
          localStorage.setItem('user', JSON.stringify(user));
          return user;
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

  atualizarPerfil(perfil: AtualizarPerfilRequestDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/perfil`, perfil)
      .pipe(
        tap(user => {
          this.currentUser = user;
          localStorage.setItem('user', JSON.stringify(user));
        }),
        catchError(error => {
          console.error('Erro ao atualizar perfil:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao atualizar perfil'));
        })
      );
  }

  atualizarSenha(senha: AtualizarSenhaRequestDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/senha`, senha)
      .pipe(
        catchError(error => {
          console.error('Erro ao atualizar senha:', error);
          return throwError(() => new Error(error.error?.mensagem || 'Erro ao atualizar senha'));
        })
      );
  }
}
