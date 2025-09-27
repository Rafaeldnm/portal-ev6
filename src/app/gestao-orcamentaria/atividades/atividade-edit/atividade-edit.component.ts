import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../models/item.model';
import { AtividadesService } from '../../services/atividades.service';
import { Atividade } from 'src/app/gestao-orcamentaria/models/atividade.model';
import { MensagemService } from 'src/app/gestao-investimentos-publicos/services/mensagem.service';

@Component({
  selector: 'app-atividade-edit',
  templateUrl: './atividade-edit.component.html',
  styleUrls: ['./atividade-edit.component.css']
})
export class AtividadeEditComponent implements OnInit {
  form: FormGroup;
  editandoAtividade = false;
  atividadeId: number | null = null;

  classificacaoOptions = [
    { value: 'Midia', label: 'Mídia' },
    { value: 'Obrigatorio', label: 'Obrigatório' }
  ];

  modalAberto = false;
  atividade: Atividade | null = null;
  itensModal: Item[] = [];
  indiceElementoModal: number | null = null;

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private atividadesService: AtividadesService,
    private mensagemService: MensagemService
  ) {
    this.form = this.fb.group({
      nomeAtividade: ['', Validators.required],
      descricao: ['', Validators.required],
      elementos: this.fb.array([])
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editandoAtividade = true;
      this.atividadeId = +id;
      this.isLoading = true;
      this.carregarAtividade(this.atividadeId);
    }
  }

  async carregarAtividade(id: number) {
    this.atividadesService.recuperarAtividade(id).subscribe({
      next: (atividade) => {
        this.atividade = atividade;

        this.form.patchValue({
          nomeAtividade: atividade.NomeAtividade,
          descricao: atividade.Descricao
        });
        this.setElementos(atividade.Elementos);

        console.log(atividade);
        this.isLoading = false;
      },
      error: (erro) => {
        this.mensagemService.mostrarErro('Erro ao carregar categoria');
        console.error('Erro ao carregar categoria:', erro);
        this.isLoading = false;
      }
    });

  }


  get elementos(): FormArray {
    return this.form.get('elementos') as FormArray;
  }

  setElementos(elementos: any[]) {
    const elementosFGs = elementos.map(el => this.fb.group({
      titulo: [el.Titulo, Validators.required],
      descricao: [el.Descricao, Validators.required],
      ficha: [el.Ficha, Validators.required],
      recurso: [el.Recurso, Validators.required],
      orcamentoInicial: [el.OrcamentoInicial, [Validators.required, Validators.min(0)]],
      orcamentoAtualizado: [el.OrcamentoAtualizado, [Validators.required, Validators.min(0)]],
      diferencaPrevistaAno: [el.DiferencaPrevistaAno, [Validators.required]],
      itens: this.fb.array(el.Itens?.map((item: any) => this.fb.group({
        Descricao: [item.Descricao, Validators.required],
        TipoGasto: [item.TipoGasto, Validators.required],
        Classificacao: [item.Classificacao, Validators.required],
        Historico: [item.Historico],
        Fornecedor: [item.Fornecedor],
        Fonte: [item.Fonte],
        Valor: this.fb.group({
          Total: [{value: item.Valor?.Total || 0, disabled: true}],
          PeriodosAnteriores: [item.Valor?.PeriodosAnteriores || 0],
          Janeiro: [item.Valor?.Janeiro || 0],
          Fevereiro: [item.Valor?.Fevereiro || 0],
          Marco: [item.Valor?.Marco || 0],
          Abril: [item.Valor?.Abril || 0],
          Maio: [item.Valor?.Maio || 0],
          Junho: [item.Valor?.Junho || 0],
          Julho: [item.Valor?.Julho || 0],
          Agosto: [item.Valor?.Agosto || 0],
          Setembro: [item.Valor?.Setembro || 0],
          Outubro: [item.Valor?.Outubro || 0],
          Novembro: [item.Valor?.Novembro || 0],
          Dezembro: [item.Valor?.Dezembro || 0],
        })
      }))) || this.fb.array([])
    }));
    const elementosFormArray = this.fb.array(elementosFGs);
    this.form.setControl('elementos', elementosFormArray);
  }

  adicionarElemento() {
    this.elementos.push(this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      ficha: ['', Validators.required],
      recurso: ['', Validators.required],
      orcamentoInicial: [0, [Validators.required, Validators.min(0)]],
      orcamentoAtualizado: [0, [Validators.required, Validators.min(0)]],
      previsaoGastosAno: [0, [Validators.required, Validators.min(0)]],
      diferencaPrevistaAno: [0, Validators.required],
      itens: this.fb.array([])
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
        const itensFormArray = elementoGroup.get('itens') as FormArray;
        itensFormArray.clear();
        let somaTotal = 0;
        itens.forEach((item: any) => {
          itensFormArray.push(this.fb.group({
            descricao: [item.descricao, Validators.required],
            tipoGasto: [item.tipoGasto, Validators.required],
            classificacao: [item.classificacao, Validators.required],
            historico: [item.historico],
            fornecedor: [item.fornecedor],
            fonte: [item.fonte],
            valor: this.fb.group({
              total: [{value: item.valor?.total || 0, disabled: true}],
              periodosAnteriores: [item.valor?.periodosAnteriores || 0],
              janeiro: [item.valor?.janeiro || 0],
              fevereiro: [item.valor?.fevereiro || 0],
              marco: [item.valor?.marco || 0],
              abril: [item.valor?.abril || 0],
              maio: [item.valor?.maio || 0],
              junho: [item.valor?.junho || 0],
              julho: [item.valor?.julho || 0],
              agosto: [item.valor?.agosto || 0],
              setembro: [item.valor?.setembro || 0],
              outubro: [item.valor?.outubro || 0],
              novembro: [item.valor?.novembro || 0],
              dezembro: [item.valor?.dezembro || 0],
            })
          }));
          somaTotal += item.valor?.total || 0;
        });
        elementoGroup.get('previsaoGastosAno')?.setValue(somaTotal);
        this.salvarAtividadeAtualizada();
      }
    }
    this.fecharModal();
  }



  salvarAtividadeAtualizada(): void {
    if (this.form.valid && this.atividadeId !== null) {
      const atividade = this.form.getRawValue();
      atividade.id = this.atividadeId;
      this.atividadesService.editarAtividade(atividade.id, atividade).subscribe({
        next: (atividadeAtualizada) => {
          this.mensagemService.mostrarSucesso(
            `Atividade '${atividadeAtualizada.NomeAtividade}' foi atualizada com sucesso`
          );
        },
        error: (erro) => {
          this.mensagemService.mostrarErro(
            erro.message || `Erro ao atualizar atividade '${this.atividade?.NomeAtividade}'`
          );
        }
      });
    }

      const idAtividade = this.route.snapshot.paramMap.get('id');
      const id = idAtividade !== null ? Number(idAtividade) : null;

      if (id !== null && !isNaN(id)) {
        this.carregarAtividade(id);
      }
    }

  onSubmit() {
    if (this.form.valid) {
      const atividade = this.form.getRawValue();
      var editarAtividade = this.editandoAtividade && this.atividadeId !== null

      if (editarAtividade) {
        atividade.id = this.atividadeId;
        this.atividadesService.editarAtividade(atividade.id, atividade).subscribe({
          next: (atividadeAtualizada) => {
            this.mensagemService.mostrarSucesso(
              `Atividade '${atividadeAtualizada.NomeAtividade}' foi atualizada com sucesso`
            );
          },
          error: (erro) => {
            this.mensagemService.mostrarErro(
              erro.message || `Erro ao atualizar atividade '${this.atividade?.NomeAtividade}'`
            );
          }
        });
      }
      else { // Criar Atividade
        this.atividadesService.addAtividade(atividade).subscribe({
          next: (atividadeNova) => {
            this.mensagemService.mostrarSucesso(
              `Atividade '${atividadeNova.NomeAtividade}' foi criada com sucesso`
            );
          },
          error: (erro) => {
            this.mensagemService.mostrarErro(
              erro.message || `Erro ao criar atividade '${atividade.NomeAtividade}'`
            );
          }
        });
      }
      this.router.navigateByUrl('/gestao-orcamentaria/atividades');
    }
  }

  onCancel() {
    this.router.navigateByUrl('/gestao-orcamentaria/atividades');
  }

}
