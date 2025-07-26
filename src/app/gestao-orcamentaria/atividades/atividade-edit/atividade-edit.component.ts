import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../item-modal/item-modal.component';

@Component({
  selector: 'app-atividade-edit',
  templateUrl: './atividade-edit.component.html',
  styleUrls: ['./atividade-edit.component.css']
})
export class AtividadeEditComponent implements OnInit {
  form: FormGroup;
  isEditing = false;
  atividadeId: number | null = null;

  classificacaoOptions = [
    { value: 'Midia', label: 'Mídia' },
    { value: 'Obrigatorio', label: 'Obrigatório' }
  ];

  modalAberto = false;
  itensModal: Item[] = [];
  indiceElementoModal: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      nomeAtividade: ['', Validators.required],
      descricao: ['', Validators.required],
      classificacao: ['', Validators.required],
      historico: [''],
      fornecedor: ['', Validators.required],
      ficha: ['', Validators.required],
      gastoTotalAno: [0, [Validators.required, Validators.min(0)]],
      elementos: this.fb.array([])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.atividadeId = +id;
      // TODO: Load activity data when we implement the service
      // this.loadAtividade(this.atividadeId);
      // For now, mock loading data from route or service
      const mockData = {
        nomeAtividade: 'Mock Atividade',
        descricao: 'Descrição da atividade mock',
        classificacao: 'Midia',
        historico: 'Histórico mock',
        fornecedor: 'Fornecedor mock',
        ficha: '123',
        gastoTotalAno: 1000,
        elementos: [
          {
            elemento: 'Elemento 1',
            descricao: 'Descrição 1',
            ficha: 'Ficha 1',
            recurso: 'Recurso 1',
            orcamentoInicial: 100000,
            orcamentoAtualizado: 110000,
            previsaoGastosAno: 105000,
            diferencaPrevistaAno: 5000,
            itens: []
          }
        ]
      };
      this.form.patchValue(mockData);
      this.setElementos(mockData.elementos);
    }
  }

  get elementos(): FormArray {
    return this.form.get('elementos') as FormArray;
  }

  setElementos(elementos: any[]) {
    const elementosFGs = elementos.map(el => this.fb.group({
      elemento: [el.elemento, Validators.required],
      descricao: [el.descricao, Validators.required],
      ficha: [el.ficha, Validators.required],
      recurso: [el.recurso, Validators.required],
      orcamentoInicial: [el.orcamentoInicial, [Validators.required, Validators.min(0)]],
      orcamentoAtualizado: [el.orcamentoAtualizado, [Validators.required, Validators.min(0)]],
      previsaoGastosAno: [el.previsaoGastosAno, [Validators.required, Validators.min(0)]],
      diferencaPrevistaAno: [el.diferencaPrevistaAno, [Validators.required]],
      itens: [el.itens || []]
    }));
    const elementosFormArray = this.fb.array(elementosFGs);
    this.form.setControl('elementos', elementosFormArray);
  }

  adicionarElemento() {
    this.elementos.push(this.fb.group({
      elemento: ['', Validators.required],
      descricao: ['', Validators.required],
      ficha: ['', Validators.required],
      recurso: ['', Validators.required],
      orcamentoInicial: [0, [Validators.required, Validators.min(0)]],
      orcamentoAtualizado: [0, [Validators.required, Validators.min(0)]],
      previsaoGastosAno: [0, [Validators.required, Validators.min(0)]],
      diferencaPrevistaAno: [0, Validators.required],
      itens: [[]]
    }));
  }

  removerElemento(index: number) {
    this.elementos.removeAt(index);
  }

  abrirModalItens(index: number): void {
    this.indiceElementoModal = index;
    const elementoGroup = this.elementos.at(index);
    const itens = elementoGroup.get('itens')?.value;
    this.itensModal = Array.isArray(itens) ? itens : [];
    this.modalAberto = true;
    // Força a detecção de mudanças se necessário (exemplo: se usar ChangeDetectorRef)
  }


  fecharModal(): void {
    this.modalAberto = false;
    this.indiceElementoModal = null;
  }

  atualizarItens(itens: any): void {
    if (this.indiceElementoModal !== null) {
      if (Array.isArray(itens)) {
        const elementoGroup = this.elementos.at(this.indiceElementoModal);
        elementoGroup.get('itens')?.setValue(itens);
      }
    }
    this.fecharModal();
  }

  onSubmit() {
    if (this.form.valid) {
      const atividade = this.form.value;
      // TODO: Save activity when we implement the service
      // this.saveAtividade(atividade);
      this.router.navigateByUrl('/gestao-orcamentaria/atividades');
    }
  }

  onCancel() {
    this.router.navigateByUrl('/gestao-orcamentaria/atividades');
  }
}
