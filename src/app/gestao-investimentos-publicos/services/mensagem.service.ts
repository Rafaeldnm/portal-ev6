import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface MensagemConfig {
  texto: string;
  tipo: 'sucesso' | 'erro' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private mensagemSubject = new Subject<MensagemConfig>();
  mensagem$ = this.mensagemSubject.asObservable();

  mostrarSucesso(texto: string) {
    this.mensagemSubject.next({ texto, tipo: 'sucesso' });
  }

  mostrarErro(texto: string) {
    this.mensagemSubject.next({ texto, tipo: 'erro' });
  }

  mostrarInfo(texto: string) {
    this.mensagemSubject.next({ texto, tipo: 'info' });
  }
}
