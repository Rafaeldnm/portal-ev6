import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { Item } from 'src/app/gestao-orcamentaria/models/item.model';

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

  replicarParaTodosOsMeses(index: number): void {
    const grupoValor = this.itensArray.at(index).get('valor') as FormGroup;
    const baseValue = grupoValor.get('janeiro')?.value || 0;
    const meses = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    meses.forEach(mes => {
      grupoValor.get(mes)?.setValue(baseValue);
    });
  }

}
