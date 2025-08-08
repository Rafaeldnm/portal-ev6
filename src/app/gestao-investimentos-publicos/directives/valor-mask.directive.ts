import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[valorMask]'
})
export class ValorMaskDirective implements OnInit {
  @Input('tipoValor') tipoValor: string = 'Financeiro';
  private valorNumerico: number = 0;

  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  ngOnInit() {
    this.formatarInput();
  }

  @HostListener('input', ['$event'])
  onInput(event: any) {
    let valorDigitado = this.el.nativeElement.value;

    // Remove tudo que não é dígito
    const somenteNumeros = valorDigitado.replace(/\D/g, '') || '0';

    if (this.tipoValor === 'Numero') {
      this.valorNumerico = Number(somenteNumeros);
    } else {
      this.valorNumerico = Number(somenteNumeros) / 100;
    }

    this.atualizarInput();
  }

  @HostListener('blur')
  onBlur() {
    this.atualizarModelo();
    this.atualizarInput();
  }

  private atualizarModelo() {
    if (this.control && this.control.control) {
      this.control.control.setValue(this.valorNumerico);
    }
  }

  @HostListener('focus')
  onFocus() {
    this.atualizarInput();
  }

  private atualizarInput() {
    let valorFormatado = '';

    if (this.tipoValor === 'Financeiro') {
      valorFormatado = this.valorNumerico.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } else if (this.tipoValor === 'Percentual') {
      valorFormatado = this.valorNumerico.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + '%';
    } else {
      valorFormatado = this.valorNumerico.toString();
    }

    this.el.nativeElement.value = valorFormatado;
  }

  // private atualizarModelo() {
  //   if (this.control && this.control.control) {
  //     this.control.control.setValue(this.valorNumerico, { emitEvent: false });
  //   }
  // }

  public formatarInput() {
    const valorInicial = this.control?.value ?? 0;
    this.valorNumerico = typeof valorInicial === 'number' ? valorInicial : 0;
    this.atualizarInput();
  }
}
