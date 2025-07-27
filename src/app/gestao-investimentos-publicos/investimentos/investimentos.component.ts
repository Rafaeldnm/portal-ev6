import { Component, OnInit, ViewChild } from '@angular/core';
import { InvestimentosService, Investimento } from '../services/investimentos.service';
import { CategoriasService, Categoria } from '../services/categorias.service';
import { MensagemService } from '../services/mensagem.service';
import { IpcaService } from '../services/ipca.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ValorMaskDirective } from '../directives/valor-mask.directive';

interface NovoInvestimento {
  CategoriaId: number;
  Valor: number | string;
  Ano: number;
  Descricao: string;
}

@Component({
  selector: 'app-investimentos',
  templateUrl: './investimentos.component.html',
  styleUrls: ['./investimentos.component.css']
})
export class InvestimentosComponent implements OnInit {
  @ViewChild(ValorMaskDirective) valorMaskDirective!: ValorMaskDirective;

  investimentos: Investimento[] = [];
  categorias: Categoria[] = [];
  modalAberto = false;
  novoInvestimento: NovoInvestimento = {
    CategoriaId: 0,
    Valor: 0,
    Ano: new Date().getFullYear(),
    Descricao: ''
  };
  investimentoParaEditar: Investimento | null = null;
  categoriaSelecionada: Categoria | null = null;

  constructor(
    private investimentosService: InvestimentosService,
    private categoriasService: CategoriasService,
    private mensagemService: MensagemService,
    private ipcaService: IpcaService
  ) { }

  ngOnInit(): void {
    this.categoriasService.listarCategorias().subscribe(
      categorias => {
        this.categorias = categorias;
        this.carregarInvestimentos();
      }
    );
  }

  carregarInvestimentos(): void {
    this.investimentosService.listarInvestimentos().pipe(
      switchMap(investimentos => {
        const atualizacoes = investimentos.map(investimento => {
          const categoria = this.categorias.find(c => c.Id === investimento.CategoriaId);
          if (categoria?.TipoValor === 'Financeiro') {
            return this.ipcaService.calcularValorCorrigido(investimento.Valor, investimento.Ano)
              .pipe(
                switchMap(valorCorrigido => {
                  investimento.ValorCorrigido = valorCorrigido;
                  return of(investimento);
                })
              );
          }
          return of(investimento);
        });

        return forkJoin(atualizacoes);
      })
    ).subscribe(investimentosAtualizados => {
      this.investimentos = investimentosAtualizados;
    });
  }

  abrirModal(): void {
    this.modalAberto = true;
    this.novoInvestimento = {
      CategoriaId: 0,
      Valor: 0,
      Ano: new Date().getFullYear(),
      Descricao: ''
    };
    this.investimentoParaEditar = null;
    this.categoriaSelecionada = null;

    // Refresh the mask formatting on the input after resetting the value
    setTimeout(() => {
      if (this.valorMaskDirective) {
        this.valorMaskDirective.formatarInput();
      }
    }, 0);

  }

  fecharModal(): void {
    this.modalAberto = false;
    this.novoInvestimento = {
      CategoriaId: 0,
      Valor: 0,
      Ano: new Date().getFullYear(),
      Descricao: ''
    };
    this.investimentoParaEditar = null;
    this.categoriaSelecionada = null;
  }

  onCategoriaChange(categoriaId: number): void {
    this.categoriaSelecionada = this.categorias.find(c => c.Id === +categoriaId) || null;
    this.novoInvestimento.Valor = 0;
  }

  formatarValor(valor: number, tipoValor: string): string {
    switch (tipoValor) {
      case 'Financeiro':
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      case 'Percentual':
        return `${valor}%`;
      case 'Numero':
        return valor.toString();
      default:
        return valor.toString();
    }
  }

  validarValor(valor: number, tipoValor: string): boolean {
    switch (tipoValor) {
      case 'Financeiro':
        return valor >= 0;
      case 'Percentual':
        return valor >= 0 && valor <= 100;
      case 'Numero':
        return Number.isInteger(valor) && valor >= 0;
      default:
        return true;
    }
  }

  salvarInvestimento(): void {
    if (!this.categoriaSelecionada) {
      this.mensagemService.mostrarErro('Selecione uma categoria');
      return;
    }

    let valorNumerico: number;

    if (typeof this.novoInvestimento.Valor === 'string') {
      valorNumerico = Number(
        this.novoInvestimento.Valor
          .toString()
          .replace(/\./g, '')   // remove pontos de milhar
          .replace(',', '.')    // troca vírgula decimal por ponto
      );
    } else {
      valorNumerico = this.novoInvestimento.Valor;
    }

    if (!this.validarValor(valorNumerico, this.categoriaSelecionada.TipoValor)) {
      this.mensagemService.mostrarErro('Valor inválido para o tipo selecionado');
      return;
    }

    this.novoInvestimento.Valor = valorNumerico;

    const investimentoParaSalvar = {
      ...this.novoInvestimento,
      Valor: valorNumerico
    };

    const operacao = this.investimentoParaEditar
      ? this.investimentosService.atualizarInvestimento(this.investimentoParaEditar.Id, investimentoParaSalvar)
      : this.investimentosService.adicionarInvestimento(investimentoParaSalvar);

    operacao.pipe(
      switchMap(() => {
        if (this.categoriaSelecionada?.TipoValor === 'Financeiro') {
          return this.ipcaService.calcularValorCorrigido(valorNumerico, this.novoInvestimento.Ano);
        }
        return of(null);
      })
    ).subscribe({
      next: () => {
        this.mensagemService.mostrarSucesso(
          this.investimentoParaEditar
            ? 'Investimento atualizado com sucesso!'
            : 'Investimento adicionado com sucesso!'
        );
        this.carregarInvestimentos();
        this.fecharModal();
      },
      error: () => {
        this.mensagemService.mostrarErro(
          this.investimentoParaEditar
            ? 'Erro ao atualizar investimento'
            : 'Erro ao adicionar investimento'
        );
      }
    });
  }

  editarInvestimento(investimento: Investimento): void {
    this.investimentoParaEditar = { ...investimento };
    this.novoInvestimento = {
      CategoriaId: investimento.CategoriaId,
      Valor: investimento.Valor,
      Ano: investimento.Ano,
      Descricao: investimento.Descricao
    };
    this.categoriaSelecionada = this.categorias.find(c => c.Id === investimento.CategoriaId) || null;
    this.modalAberto = true;
  }

  excluirInvestimento(investimento: Investimento): void {
    if (confirm(`Deseja realmente excluir este investimento?`)) {
      this.investimentosService.excluirInvestimento(investimento.Id).subscribe({
        next: () => {
          this.mensagemService.mostrarSucesso('Investimento excluído com sucesso!');
          this.carregarInvestimentos();
        },
        error: () => {
          this.mensagemService.mostrarErro('Erro ao excluir investimento');
        }
      });
    }
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.Id === categoriaId);
    return categoria ? categoria.Nome : '';
  }

  getCategoriaValorTipo(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.Id === categoriaId);
    return categoria ? categoria.TipoValor : 'Financeiro';
  }
}
