// import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { AtividadesService } from '../../services/atividades.service';
// import { Item } from '../../models/item.model';

// @Component({
//   selector: 'app-item-modal',
//   templateUrl: './item-modal.component.html',
//   styleUrls: ['./item-modal.component.css']
// })
// export class ItemModalComponent implements OnInit {
//   @Input() itens: Item[] = [];
//   @Output() itensChange = new EventEmitter<Item[]>();
//   @Output() close = new EventEmitter<void>();
//   form: FormGroup;

//   tiposGasto = ['Obrigatório', 'Importante', 'Outros'];
//   classificacoes = ['Midia', 'Outros'];

//   constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private atividadesService: AtividadesService) {
//     this.form = this.fb.group({
//       itensArray: this.fb.array([])
//     });
//   }

//   ngOnInit(): void {
//     this.form = this.fb.group({
//       itensArray: this.fb.array([])
//     });

//     this.inicializarFormulario();
//   }

//   inicializarFormulario(): void {
//     this.listaItens?.clear();

//     if (this.itens?.length) {
//       this.itens.forEach((item, indice) => {
//         const grupoItem = this.criarGrupoItem(item);
//         this.listaItens.push(grupoItem);
//         this.assinarMudancasValor(grupoItem);
//         this.atualizarTotal(grupoItem);
//       });
//     }

//     this.cdr.detectChanges();
//   }

//   // 👉 Getter para facilitar acesso ao FormArray
//   get listaItens(): FormArray {
//     return this.form.get('itensArray') as FormArray;
//   }

//   // 👉 Cria um grupo de item com os meses + total
//   criarGrupoItem(item?: Item): FormGroup {
//     return this.fb.group({
//       descricao: [item?.descricao ?? '', Validators.required],
//       tipoGasto: [item?.tipoGasto ?? 'Obrigatório', Validators.required],
//       classificacao: [item?.classificacao ?? 'Midia', Validators.required],
//       historico: [item?.historico ?? ''],
//       fornecedor: [item?.fornecedor ?? ''],
//       fonte: [item?.fonte ?? ''],
//       valor: this.fb.group({
//         total: [{ value: item?.valor?.total ?? 0, disabled: true }],
//         periodosAnteriores: [item?.valor?.periodosAnteriores ?? 0],
//         janeiro: [item?.valor?.janeiro ?? 0],
//         fevereiro: [item?.valor?.fevereiro ?? 0],
//         marco: [item?.valor?.marco ?? 0],
//         abril: [item?.valor?.abril ?? 0],
//         maio: [item?.valor?.maio ?? 0],
//         junho: [item?.valor?.junho ?? 0],
//         julho: [item?.valor?.julho ?? 0],
//         agosto: [item?.valor?.agosto ?? 0],
//         setembro: [item?.valor?.setembro ?? 0],
//         outubro: [item?.valor?.outubro ?? 0],
//         novembro: [item?.valor?.novembro ?? 0],
//         dezembro: [item?.valor?.dezembro ?? 0],
//       })
//     });
//   }

//   // 👉 Atualiza o total com base nos valores dos meses
//   atualizarTotal(grupoItem: FormGroup): void {
//     const grupoValor = grupoItem.get('valor') as FormGroup;

//     if (!grupoValor) return;

//     const total = Object.entries(grupoValor.controls)
//       .filter(([nomeCampo]) => nomeCampo !== 'total')
//       .reduce((soma, [_, controle]) => {
//         const valor = controle.value;
//         const numero = typeof valor === 'number' ? valor : 0;
//         return soma + numero;
//       }, 0);

//     grupoValor.get('total')?.setValue(total, { emitEvent: false });
//   }

//   // 👉 Faz a soma automática com valueChanges
//   assinarMudancasValor(grupoItem: FormGroup): void {
//     const grupoValor = grupoItem.get('valor') as FormGroup;

//     grupoValor.valueChanges.subscribe((valores: Record<string, any>) => {
//       const total = Object.entries(valores)
//         .filter(([nome]) => nome !== 'total')
//         .reduce((soma, [_, valor]) => {
//           let numero = valor;

//           if (typeof numero === 'string') {
//             numero = numero.replace(/[^0-9,-]/g, '').replace(/\./g, '').replace(',', '.');
//             numero = parseFloat(numero);
//           }

//           if (isNaN(numero)) numero = 0;
//           return soma + numero;
//         }, 0);

//       grupoValor.get('total')?.setValue(total, { emitEvent: false });
//     });
//   }

//   // ngOnInit(): void {
//   //   this.inicializarFormulario();
//   // }

//   // inicializarFormulario(): void {
//   //   this.itensArray.clear();
//   //   if (this.itens && this.itens.length > 0) {
//   //     this.itens.forEach((item, index) => {
//   //       this.itensArray.push(this.createItemGroup(item));
//   //       this.subscribeToValueChangesForIndex(index);
//   //       this.atualizarTotal(index);
//   //     });
//   //   }
//   //   this.cdr.detectChanges();
//   // }

//   // atualizarTotal(index: number): void {
//   //   const valorGroup = this.itensArray.at(index).get('valor') as FormGroup;

//   //   if (!valorGroup) return;

//   //   const total = Object.entries(valorGroup.controls)
//   //     .filter(([key]) => key !== 'total')
//   //     .reduce((acc, [_, control]) => {
//   //       const value = control.value;
//   //       const numero = typeof value === 'number' ? value : 0;
//   //       return acc + numero;
//   //     }, 0);

//   //   // Define o total como number puro
//   //   valorGroup.get('total')?.setValue(total);
//   // }

//   // createItemGroup(item?: Item): FormGroup {
//   //   return this.fb.group({
//   //     descricao: [item?.descricao || '', Validators.required],
//   //     tipoGasto: [item?.tipoGasto || 'Obrigatório', Validators.required],
//   //     classificacao: [item?.classificacao || 'Midia', Validators.required],
//   //     historico: [item?.historico || ''],
//   //     fornecedor: [item?.fornecedor || ''],
//   //     fonte: [item?.fonte || ''],
//   //     valor: this.fb.group({
//   //       total: [{value: item?.valor?.total || 0, disabled: true}],
//   //       periodosAnteriores: [item?.valor?.periodosAnteriores || 0],
//   //       janeiro: [item?.valor?.janeiro || 0],
//   //       fevereiro: [item?.valor?.fevereiro || 0],
//   //       marco: [item?.valor?.marco || 0],
//   //       abril: [item?.valor?.abril || 0],
//   //       maio: [item?.valor?.maio || 0],
//   //       junho: [item?.valor?.junho || 0],
//   //       julho: [item?.valor?.julho || 0],
//   //       agosto: [item?.valor?.agosto || 0],
//   //       setembro: [item?.valor?.setembro || 0],
//   //       outubro: [item?.valor?.outubro || 0],
//   //       novembro: [item?.valor?.novembro || 0],
//   //       dezembro: [item?.valor?.dezembro || 0],
//   //     })
//   //   });
//   // }




//   adicionarItem(): void {
//     const novoGrupoItem = this.criarGrupoItem();
//     this.listaItens.push(novoGrupoItem);
//     this.assinarMudancasValor(novoGrupoItem);
//   }

//   // subscribeToValueChangesForIndex(index: number): void {
//   //   const itemGroup = this.itensArray.at(index);
//   //   const valorGroup = itemGroup.get('valor') as FormGroup;
//   //   Object.keys(valorGroup.controls).forEach(key => {
//   //     if (key !== 'total') {
//   //       valorGroup.get(key)?.valueChanges.subscribe(() => {
//   //         this.atualizarTotal(index);
//   //       });
//   //     }
//   //   });
//   // }

//   ngOnChanges(): void {
//     this.inicializarFormulario();
//   }

//   get itensArray(): FormArray {
//     return this.form.get('itensArray') as FormArray;
//   }



//   removeItem(index: number): void {
//     this.itensArray.removeAt(index);
//   }



//   salvar(): void {
//     if (this.form.valid) {
//       // Extrai os dados do formulário
//       const itens: Item[] = this.listaItens.getRawValue();

//       // Calcula a soma total de todos os itens
//       const somaTotal = itens.reduce((soma, item) => {
//         const total = item.valor?.total ?? 0;
//         return soma + total;
//       }, 0);

//       // Emite os itens atualizados
//       this.itensChange.emit(itens);

//       // Se quiser emitir a soma separadamente, você pode criar outro Output:
//       // this.somaTotalChange.emit(somaTotal);

//       // Fecha o modal ou executa ação final
//       this.close.emit();
//     }
//   }



//   replicateToAllMonths(index: number): void {
//     const valorGroup = this.itensArray.at(index).get('valor') as FormGroup;
//     const baseValue = valorGroup.get('janeiro')?.value || 0;
//     const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
//     months.forEach(month => {
//       valorGroup.get(month)?.setValue(baseValue, { emitEvent: false });
//     });
//     // this.atualizarTotal(index);
//   }
// }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Item } from 'src/app/gestao-orcamentaria/models/item.model';

// export interface Valor {
//   total: number;
//   periodosAnteriores: number;
//   janeiro: number;
//   fevereiro: number;
//   marco: number;
//   abril: number;
//   maio: number;
//   junho: number;
//   julho: number;
//   agosto: number;
//   setembro: number;
//   outubro: number;
//   novembro: number;
//   dezembro: number;
// }

// export interface Item {
//   descricao: string;
//   tipoGasto: string;
//   classificacao: string;
//   historico?: string;
//   fornecedor?: string;
//   fonte?: string;
//   valor: Valor;
// }

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent implements OnInit {
  @Input() itens: Item[] = [];
  @Output() itensChange = new EventEmitter<Item[]>();
  @Output() fechar = new EventEmitter<void>();

  formulario!: FormGroup;

  tiposGasto = ['Obrigatório', 'Importante', 'Outros'];
  classificacoes = ['Midia', 'Outros'];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log("Itens iniciais:", this.itens);

    this.formulario = this.fb.group({
      itensArray: this.fb.array([])
    });

    this.inicializarFormulario();
  }

  get itensArray(): FormArray {
    return this.formulario.get('itensArray') as FormArray;
  }

  inicializarFormulario(): void {
    this.itensArray.clear();

    if (this.itens && this.itens.length > 0) {
      this.itens.forEach((item) => {
        const grupo = this.criarGrupoItem(item);
        this.itensArray.push(grupo);
        this.assinarMudancasValor(grupo);
        this.atualizarTotal(grupo);
      });
    }

    this.cdr.detectChanges();
  }

  criarGrupoItem(item?: Item): FormGroup {
    return this.fb.group({
      descricao: [item?.Descricao || '', Validators.required],
      tipoGasto: [item?.TipoGasto || 'Obrigatório', Validators.required],
      classificacao: [item?.Classificacao || 'Midia', Validators.required],
      historico: [item?.Historico || ''],
      fornecedor: [item?.Fornecedor || ''],
      fonte: [item?.Fonte || ''],
      valor: this.fb.group({
        total: [{ value: item?.Valor?.Total || 0, disabled: true }],
        periodosAnteriores: [item?.Valor?.PeriodosAnteriores || 0],
        janeiro: [item?.Valor?.Janeiro || 0],
        fevereiro: [item?.Valor?.Fevereiro || 0],
        marco: [item?.Valor?.Marco || 0],
        abril: [item?.Valor?.Abril || 0],
        maio: [item?.Valor?.Maio || 0],
        junho: [item?.Valor?.Junho || 0],
        julho: [item?.Valor?.Julho || 0],
        agosto: [item?.Valor?.Agosto || 0],
        setembro: [item?.Valor?.Setembro || 0],
        outubro: [item?.Valor?.Outubro || 0],
        novembro: [item?.Valor?.Novembro || 0],
        dezembro: [item?.Valor?.Dezembro || 0]
      })
    });
  }

  adicionarItem(): void {
    const grupo = this.criarGrupoItem();
    this.itensArray.push(grupo);
    this.assinarMudancasValor(grupo);
  }

  assinarMudancasValor(grupoItem: FormGroup): void {
    const grupoValor = grupoItem.get('valor') as FormGroup;

    grupoValor.valueChanges.subscribe((valores: Record<string, string | number>) => {
      debugger;

      const total = Object.entries(valores)
        .filter(([chave]) => chave !== 'total')
        .reduce((soma, [_, valor]) => {
          let numero: number = 0;

          if (typeof valor === 'string') {
            const valorLimpo = valor.replace(/[^0-9,-]/g, '').replace(/\./g, '').replace(',', '.');
            numero = parseFloat(valorLimpo);
          } else if (typeof valor === 'number') {
            numero = valor;
          }

          if (isNaN(numero)) numero = 0;
          return soma + numero;
        }, 0);

      grupoValor.get('total')?.setValue(total, { emitEvent: false });
    });
  }

  atualizarTotal(grupoItem: FormGroup): void {
    debugger;

    const grupoValor = grupoItem.get('valor') as FormGroup;

    const total = Object.entries(grupoValor.controls)
      .filter(([chave]) => chave !== 'total')
      .reduce((soma, [_, controle]) => {
        const valor = controle.value;
        let numero: number = 0;

        if (typeof valor === 'string') {
          const formatado = valor.replace(/[^0-9,-]/g, '').replace(/\./g, '').replace(',', '.');
          numero = parseFloat(formatado);
        } else if (typeof valor === 'number') {
          numero = valor;
        }

        if (isNaN(numero)) numero = 0;
        return soma + numero;
      }, 0);

    grupoValor.get('total')?.setValue(total, { emitEvent: false });
  }

  salvar(): void {
    if (this.formulario.valid) {
      const itens: Item[] = this.itensArray.getRawValue();

      this.itensChange.emit(itens);
      this.fechar.emit();
    }
  }

  fecharModal(): void {
    this.fechar.emit();
  }

  removeItem(index: number): void {
    this.itensArray.removeAt(index);
  }

  replicateToAllMonths(index: number): void {
    const grupoValor = this.itensArray.at(index).get('valor') as FormGroup;
    const baseValue = grupoValor.get('janeiro')?.value || 0;
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    meses.forEach(mes => {
      grupoValor.get(mes)?.setValue(baseValue, { emitEvent: false });
    });
    // Atualiza o total após replicar
    // this.atualizarTotal(this.itensArray.at(index));
  }

  formatarValor(valor: any): string {
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    return valor;
  }

  onInput(event: any, mes: string) {
    debugger;

    const valorDigitado = event.target;

    const somenteNumeros = valorDigitado.replace(/\D/g, '') || '0';

    const valorNumerico = Number(somenteNumeros) / 100;

    let valorFormatado = '';

    valorFormatado = valorNumerico.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    // this.formulario..value = valorFormatado;
  }

  onInputMonetario(event: any, mes: string, index: number): void {
    debugger;

    const input = event.target;
    const somenteNumeros = input.value.replace(/\D/g, '') || '0';
    const valorNumerico = parseFloat(somenteNumeros) / 100;

    const grupoValor = (this.formulario.get('itens') as FormArray)
      .at(index)
      .get('valor') as FormGroup;

    grupoValor.get(mes)?.setValue(valorNumerico);
  }

  formatarCampo(mes: string): void {
    const grupoValor = this.formulario.get('Valor') as FormGroup;
    const valor = grupoValor.get(mes)?.value;

    if (typeof valor === 'number') {
      grupoValor.get(mes)?.setValue(valor, { emitEvent: false }); // evita loop
    }
  }
}
