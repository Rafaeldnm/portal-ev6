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
    Nome: '',
    Descricao: '',
    TipoValor: 'Financeiro' as 'Financeiro' | 'Percentual' | 'Numero'
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
    this.categoriasService.listarCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        console.log(categorias);
      },
      error: (erro) => {
        this.mensagemService.mostrarErro('Erro ao carregar categorias');
        console.error('Erro ao carregar categorias:', erro);
      }
    });
  }

  abrirModalNovaCategoria(): void {
    this.modalAberto = true;
    this.novaCategoria = {
      Nome: '',
      Descricao: '',
      TipoValor: 'Financeiro'
    };
    this.categoriaParaEditar = null;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.novaCategoria = {
      Nome: '',
      Descricao: '',
      TipoValor: 'Financeiro'
    };
    this.categoriaParaEditar = null;
  }

  salvarCategoria(): void {
    if (this.categoriaParaEditar) {
      this.categoriasService.atualizarCategoria(
        this.categoriaParaEditar.Id,
        { ...this.novaCategoria }
      ).subscribe({
        next: (categoriaAtualizada) => {
          this.mensagemService.mostrarSucesso(
            `Categoria ${categoriaAtualizada.Nome} foi atualizada com sucesso`
          );
          this.carregarCategorias();
          this.fecharModal();
        },
        error: (erro) => {
          this.mensagemService.mostrarErro(
            erro.message || `Erro ao atualizar categoria ${this.novaCategoria.Nome}`
          );
        }
      });
    } else {
      this.categoriasService.adicionarCategoria(this.novaCategoria).subscribe({
        next: (categoriaCriada) => {
          this.mensagemService.mostrarSucesso(
            `Categoria ${categoriaCriada.Nome} foi inserida com sucesso`
          );
          this.carregarCategorias();
          this.fecharModal();
        },
        error: (erro) => {
          this.mensagemService.mostrarErro(
            erro.message || `Erro ao inserir categoria ${this.novaCategoria.Nome}`
          );
        }
      });
    }
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaParaEditar = { ...categoria };
    this.novaCategoria = {
      Nome: categoria.Nome,
      Descricao: categoria.Descricao,
      TipoValor: categoria.TipoValor
    };
    this.modalAberto = true;
  }

  excluirCategoria(categoria: Categoria): void {
    if (confirm(`Deseja realmente excluir a categoria ${categoria.Nome}?`)) {
      this.categoriasService.excluirCategoria(categoria.Id).subscribe({
        next: () => {
          this.mensagemService.mostrarSucesso(
            `Categoria ${categoria.Nome} foi excluída com sucesso`
          );
          this.carregarCategorias();
        },
        error: (erro) => {
          this.mensagemService.mostrarErro(
            erro.message || `Erro ao excluir categoria ${categoria.Nome}`
          );
        }
      });
    }
  }
}
