import { Component, OnInit } from '@angular/core';
import { InvestimentosService, Investimento } from '../services/investimentos.service';
import { CategoriasService, Categoria } from '../services/categorias.service';
import { MensagemService } from '../services/mensagem.service';
import { IpcaService } from '../services/ipca.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-investimentos',
  templateUrl: './investimentos.component.html',
  styleUrls: ['./investimentos.component.css']
})
export class InvestimentosComponent implements OnInit {
  investimentos: Investimento[] = [];
  categorias: Categoria[] = [];
  modalAberto = false;
  novoInvestimento = {
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

    if (!this.validarValor(this.novoInvestimento.Valor, this.categoriaSelecionada.TipoValor)) {
      this.mensagemService.mostrarErro('Valor inválido para o tipo selecionado');
      return;
    }

    const operacao = this.investimentoParaEditar
      ? this.investimentosService.atualizarInvestimento(this.investimentoParaEditar.Id, this.novoInvestimento)
      : this.investimentosService.adicionarInvestimento(this.novoInvestimento);

    operacao.pipe(
      switchMap(() => {
        if (this.categoriaSelecionada?.TipoValor === 'Financeiro') {
          return this.ipcaService.calcularValorCorrigido(this.novoInvestimento.Valor, this.novoInvestimento.Ano);
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
