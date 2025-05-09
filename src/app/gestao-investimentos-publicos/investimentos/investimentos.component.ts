import { Component, OnInit } from '@angular/core';
import { InvestimentosService, Investimento } from '../services/investimentos.service';
import { CategoriasService, Categoria } from '../services/categorias.service';
import { MensagemService } from '../services/mensagem.service';

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
    categoriaId: 0,
    valor: 0,
    ano: new Date().getFullYear(),
    descricao: ''
  };
  investimentoParaEditar: Investimento | null = null;
  categoriaSelecionada: Categoria | null = null;

  constructor(
    private investimentosService: InvestimentosService,
    private categoriasService: CategoriasService,
    private mensagemService: MensagemService
  ) { }

  ngOnInit(): void {
    this.carregarInvestimentos();
    this.carregarCategorias();
  }

  carregarInvestimentos(): void {
    this.investimentosService.listarInvestimentos().subscribe(
      investimentos => this.investimentos = investimentos
    );
  }

  carregarCategorias(): void {
    this.categoriasService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  abrirModal(): void {
    this.modalAberto = true;
    this.novoInvestimento = {
      categoriaId: 0,
      valor: 0,
      ano: new Date().getFullYear(),
      descricao: ''
    };
    this.investimentoParaEditar = null;
    this.categoriaSelecionada = null;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.novoInvestimento = {
      categoriaId: 0,
      valor: 0,
      ano: new Date().getFullYear(),
      descricao: ''
    };
    this.investimentoParaEditar = null;
    this.categoriaSelecionada = null;
  }

  onCategoriaChange(categoriaId: number): void {
    this.categoriaSelecionada = this.categorias.find(c => c.id === +categoriaId) || null;
    // Reset valor when changing category
    this.novoInvestimento.valor = 0;
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

    if (!this.validarValor(this.novoInvestimento.valor, this.categoriaSelecionada.tipoValor)) {
      this.mensagemService.mostrarErro('Valor inválido para o tipo selecionado');
      return;
    }

    if (this.investimentoParaEditar) {
      this.investimentosService.atualizarInvestimento(
        this.investimentoParaEditar.id,
        this.novoInvestimento
      ).subscribe({
        next: (investimentoAtualizado) => {
          if (investimentoAtualizado) {
            this.mensagemService.mostrarSucesso('Investimento atualizado com sucesso!');
            this.carregarInvestimentos();
            this.fecharModal();
          }
        },
        error: () => {
          this.mensagemService.mostrarErro('Erro ao atualizar investimento');
        }
      });
    } else {
      this.investimentosService.adicionarInvestimento(this.novoInvestimento).subscribe({
        next: (investimentoCriado) => {
          this.mensagemService.mostrarSucesso('Investimento adicionado com sucesso!');
          this.carregarInvestimentos();
          this.fecharModal();
        },
        error: () => {
          this.mensagemService.mostrarErro('Erro ao adicionar investimento');
        }
      });
    }
  }

  editarInvestimento(investimento: Investimento): void {
    this.investimentoParaEditar = { ...investimento };
    this.novoInvestimento = {
      categoriaId: investimento.categoriaId,
      valor: investimento.valor,
      ano: investimento.ano,
      descricao: investimento.descricao
    };
    this.categoriaSelecionada = this.categorias.find(c => c.id === investimento.categoriaId) || null;
    this.modalAberto = true;
  }

  excluirInvestimento(investimento: Investimento): void {
    if (confirm(`Deseja realmente excluir este investimento?`)) {
      this.investimentosService.excluirInvestimento(investimento.id).subscribe({
        next: (sucesso) => {
          if (sucesso) {
            this.mensagemService.mostrarSucesso('Investimento excluído com sucesso!');
            this.carregarInvestimentos();
          }
        },
        error: () => {
          this.mensagemService.mostrarErro('Erro ao excluir investimento');
        }
      });
    }
  }

  getCategoriaNome(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nome : '';
  }

  getCategoriaValorTipo(categoriaId: number): string {
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.tipoValor : 'Financeiro';
  }
}
