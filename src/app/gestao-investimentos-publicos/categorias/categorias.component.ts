import { Component, OnInit } from '@angular/core';
import { CategoriasService, Categoria } from '../services/categorias.service';
import { MensagemService } from '../services/mensagem.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  novaCategoria = {
    nome: '',
    descricao: '',
    tipoValor: 'Financeiro' as 'Financeiro' | 'Percentual' | 'Numero'
  };
  categoriaParaEditar: Categoria | null = null;
  modalAberto = false;
  tiposValor = ['Financeiro', 'Percentual', 'Numero'];

  constructor(
    private categoriasService: CategoriasService,
    private mensagemService: MensagemService
  ) { }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    this.categoriasService.listarCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  abrirModalNovaCategoria(): void {
    this.modalAberto = true;
    this.novaCategoria = {
      nome: '',
      descricao: '',
      tipoValor: 'Financeiro'
    };
    this.categoriaParaEditar = null;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.novaCategoria = {
      nome: '',
      descricao: '',
      tipoValor: 'Financeiro'
    };
    this.categoriaParaEditar = null;
  }

  salvarCategoria(): void {
    if (this.categoriaParaEditar) {
      this.categoriasService.atualizarCategoria(
        this.categoriaParaEditar.id,
        { ...this.novaCategoria }
      ).subscribe({
        next: (categoriaAtualizada) => {
          if (categoriaAtualizada) {
            this.mensagemService.mostrarSucesso(
              `Categoria ${categoriaAtualizada.nome} foi atualizada com sucesso`
            );
            this.carregarCategorias();
            this.fecharModal();
          }
        },
        error: () => {
          this.mensagemService.mostrarErro(
            `Erro ao atualizar categoria ${this.novaCategoria.nome}`
          );
        }
      });
    } else {
      this.categoriasService.adicionarCategoria(this.novaCategoria).subscribe({
        next: (categoriaCriada) => {
          this.mensagemService.mostrarSucesso(
            `Categoria ${categoriaCriada.nome} foi inserida com sucesso`
          );
          this.carregarCategorias();
          this.fecharModal();
        },
        error: () => {
          this.mensagemService.mostrarErro(
            `Erro ao inserir categoria ${this.novaCategoria.nome}`
          );
        }
      });
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaParaEditar = { ...categoria };
    this.novaCategoria = {
      nome: categoria.nome,
      descricao: categoria.descricao,
      tipoValor: categoria.tipoValor
    };
    this.modalAberto = true;
  }

  excluirCategoria(categoria: Categoria): void {
    if (confirm(`Deseja realmente excluir a categoria ${categoria.nome}?`)) {
      this.categoriasService.excluirCategoria(categoria.id).subscribe({
        next: (sucesso) => {
          if (sucesso) {
            this.mensagemService.mostrarSucesso(
              `Categoria ${categoria.nome} foi excluída com sucesso`
            );
            this.carregarCategorias();
          }
        },
        error: () => {
          this.mensagemService.mostrarErro(
            `Erro ao excluir categoria ${categoria.nome}`
          );
        }
      });
    }
  }
}
