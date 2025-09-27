import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-item-visualizar-modal',
  templateUrl: './item-visualizar-modal.component.html',
  styleUrls: ['./item-visualizar-modal.component.css']
})
export class ItemVisualizarModalComponent {
  @Input() itens: Item[] = [];
  @Output() fechar = new EventEmitter<void>();

  constructor() {}

  fecharModal(): void {
    this.fechar.emit();
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
