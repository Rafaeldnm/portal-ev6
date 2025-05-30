import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[valorMask]'
})
export class ValorMaskDirective {
  @Input('tipoValor') tipoValor: string = 'Financeiro';
  private valorAtual = '0';

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'Enter') {
      return;
    }

    event.preventDefault();

    if (event.key === 'Backspace') {
      this.valorAtual = this.valorAtual.slice(0, -1);
      if (this.valorAtual === '') {
        this.valorAtual = '0';
      }
    } else if (event.key === 'Delete') {
      this.valorAtual = '0';
    } else if (/^\d$/.test(event.key)) {
      if (this.valorAtual === '0') {
        this.valorAtual = event.key;
      } else {
        this.valorAtual += event.key;
      }
    } else {
      return;
    }

    this.atualizarValor();
  }

  private atualizarValor() {
    let valor: number;
    if (this.tipoValor === 'Numero') {
      valor = Number(this.valorAtual);
      this.el.nativeElement.value = valor.toString();
    } else {
      valor = Number(this.valorAtual) / 100;
      if (this.tipoValor === 'Financeiro') {
        this.el.nativeElement.value = valor.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      } else {
        this.el.nativeElement.value = valor.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) + '%';
      }
    }

    if (this.control && this.control.control) {
      this.control.control.setValue(valor, { emitEvent: false });
    }
  }

  @HostListener('focus')
  onFocus() {
    const valor = this.control?.value || 0;
    this.valorAtual = this.tipoValor === 'Numero' ?
      Math.floor(valor).toString() :
      Math.floor(valor * 100).toString();
    this.atualizarValor();
  }
}
