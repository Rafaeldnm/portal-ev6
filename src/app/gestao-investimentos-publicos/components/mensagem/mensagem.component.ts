import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MensagemService } from '../../services/mensagem.service';

@Component({
  selector: 'app-mensagem',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="texto"
         [@fadeInOut]
         class="mensagem-container"
         [class.sucesso]="tipo === 'sucesso'"
         [class.erro]="tipo === 'erro'"
         [class.info]="tipo === 'info'">
      <i class="fas"
         [class.fa-check-circle]="tipo === 'sucesso'"
         [class.fa-exclamation-circle]="tipo === 'erro'"
         [class.fa-info-circle]="tipo === 'info'">
      </i>
      <span>{{ texto }}</span>
    </div>
  `,
  styles: [`
    .mensagem-container {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-width: 400px;
    }

    .sucesso {
      background-color: #22c55e;
      color: white;
    }

    .erro {
      background-color: #ef4444;
      color: white;
    }

    .info {
      background-color: #3b82f6;
      color: white;
    }

    i {
      font-size: 20px;
    }

    span {
      font-size: 14px;
      font-weight: 500;
    }
  `],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class MensagemComponent implements OnInit {
  texto: string = '';
  tipo: 'sucesso' | 'erro' | 'info' = 'info';
  private timeoutId: any;

  constructor(private mensagemService: MensagemService) {}

  ngOnInit() {
    this.mensagemService.mensagem$.subscribe(config => {
      if (config) {
        this.texto = config.texto;
        this.tipo = config.tipo;

        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
          this.texto = '';
        }, 5000);
      }
    });
  }
}
