import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface Item {
  descricao: string;
  tipoGasto: 'Obrigatório' | 'Importante' | 'Outros';
  classificacao: 'Midia' | 'Outros';
  historico: string;
  fornecedor: string;
  fonte: string;
  valor: {
    total: number;
    periodosAnteriores: number;
    janeiro: number;
    fevereiro: number;
    marco: number;
    abril: number;
    maio: number;
    junho: number;
    julho: number;
    agosto: number;
    setembro: number;
    outubro: number;
    novembro: number;
    dezembro: number;
  };
}

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.css']
})
export class ItemModalComponent implements OnInit {
  @Input() itens: Item[] = [];
  @Output() itensChange = new EventEmitter<Item[]>();
  @Output() close = new EventEmitter<void>();
  form: FormGroup;

  tiposGasto = ['Obrigatório', 'Importante', 'Outros'];
  classificacoes = ['Midia', 'Outros'];

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      itensArray: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.itensArray.clear();
    if (this.itens && this.itens.length > 0) {
      this.itens.forEach(item => {
        this.itensArray.push(this.createItemGroup(item));
      });
    }
    this.cdr.detectChanges();
  }

  ngOnChanges(): void {
    this.initializeForm();
  }

  get itensArray(): FormArray {
    return this.form.get('itensArray') as FormArray;
  }

  createItemGroup(item?: Item): FormGroup {
    return this.fb.group({
      descricao: [item?.descricao || '', Validators.required],
      tipoGasto: [item?.tipoGasto || 'Obrigatório', Validators.required],
      classificacao: [item?.classificacao || 'Midia', Validators.required],
      historico: [item?.historico || ''],
      fornecedor: [item?.fornecedor || ''],
      fonte: [item?.fonte || ''],
      valor: this.fb.group({
        total: [{value: item?.valor?.total || 0, disabled: true}],
        periodosAnteriores: [item?.valor?.periodosAnteriores || 0],
        janeiro: [item?.valor?.janeiro || 0],
        fevereiro: [item?.valor?.fevereiro || 0],
        marco: [item?.valor?.marco || 0],
        abril: [item?.valor?.abril || 0],
        maio: [item?.valor?.maio || 0],
        junho: [item?.valor?.junho || 0],
        julho: [item?.valor?.julho || 0],
        agosto: [item?.valor?.agosto || 0],
        setembro: [item?.valor?.setembro || 0],
        outubro: [item?.valor?.outubro || 0],
        novembro: [item?.valor?.novembro || 0],
        dezembro: [item?.valor?.dezembro || 0],
      })
    });
  }

  addItem(): void {
    this.itensArray.push(this.createItemGroup());
  }

  removeItem(index: number): void {
    this.itensArray.removeAt(index);
  }

  atualizarTotal(index: number): void {
    const valorGroup = this.itensArray.at(index).get('valor') as FormGroup;
    const total = Object.keys(valorGroup.controls)
      .filter(key => key !== 'total')
      .reduce((sum, key) => sum + (valorGroup.get(key)?.value || 0), 0);
    valorGroup.get('total')?.setValue(total, { emitEvent: false });
  }

  save(): void {
    if (this.form.valid) {
      const itens: Item[] = this.itensArray.getRawValue();
      this.itensChange.emit(itens);
      this.close.emit();
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  replicateToAllMonths(index: number): void {
    const valorGroup = this.itensArray.at(index).get('valor') as FormGroup;
    const baseValue = valorGroup.get('janeiro')?.value || 0;
    const months = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    months.forEach(month => {
      valorGroup.get(month)?.setValue(baseValue, { emitEvent: false });
    });
    this.atualizarTotal(index);
  }
}
