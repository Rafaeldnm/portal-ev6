import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: string;
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
  private users: User[] = [
    {
      id: 1,
      nome: 'Administrador',
      email: 'admin@example.com',
      perfil: 'admin'
    }
  ];

  constructor() { }

  login(email: string, senha: string): Observable<User> {
    // Simulação de API - Em produção, isso seria uma chamada HTTP real
    const user = this.users.find(u => u.email === email);

    if (!user) {
      return new Observable(subscriber => {
        setTimeout(() => {
          subscriber.error(new Error('Usuário não encontrado'));
        }, 1000);
      });
    }

    return of(user).pipe(
      delay(1000),
      tap(user => {
        this.currentUser = user;
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  registro(dados: RegistroUsuario): Observable<User> {
    // Simulação de API - Em produção, isso seria uma chamada HTTP real
    if (this.users.some(u => u.email === dados.email)) {
      return new Observable(subscriber => {
        setTimeout(() => {
          subscriber.error(new Error('Email já cadastrado'));
        }, 1000);
      });
    }

    const newUser: User = {
      id: this.users.length + 1,
      nome: dados.nome,
      email: dados.email,
      perfil: 'user'
    };

    this.users.push(newUser);

    return of(newUser).pipe(delay(1000));
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.currentUser || !!localStorage.getItem('user');
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
}
