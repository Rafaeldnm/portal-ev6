import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AtividadesService } from '../../services/atividades.service';
import { Atividade } from '../../models/atividade.model';
import { MensagemService } from 'src/app/gestao-investimentos-publicos/services/mensagem.service';
import { ElementoSubGrid } from 'src/app/gestao-orcamentaria/models/elemento-sub-grid.model';
import { Item } from 'src/app/gestao-orcamentaria/models/item.model';

@Component({
  selector: 'app-atividades-grid',
  templateUrl: './atividades-grid.component.html',
  styleUrls: ['./atividades-grid.component.css']
})
export class AtividadesGridComponent implements OnInit {
  displayedColumns: string[] = [
    'Expand',
    'NomeAtividade',
    'Descricao',
    'OrcamentoInicial',
    'OrcamentoAtualizado',
    'PrevisaoGastosAno',
    'DiferencaPrevista',
    'Acoes'
  ];

  displayedColumnsSubGrid: string[] = [
    'Titulo',
    'Descricao',
    'Ficha',
    'Recurso',
    'OrcamentoInicial',
    'OrcamentoAtualizado',
    'PrevisaoGastosAno',
    'DiferencaPrevistaAno',
    'Acoes'
  ];

  atividades: Atividade[] = [];
  linhasExpandidas: Set<Atividade> = new Set<Atividade>();

  modalAberto: boolean = false;
  itensModal: Item[] = [];

  isLoading: boolean = true;

  constructor(private router: Router,
    private atividadesService: AtividadesService,
    private mensagemService: MensagemService
    ) {}

  ngOnInit() {
    this.carregarAtividades();
  }

  carregarAtividades() {
    this.isLoading = true;
    this.atividadesService.listarAtividades().subscribe({
      next: (atividades) => {
        this.atividades = atividades;
        this.calcularTotais();
        console.log(atividades);
        this.isLoading = false;
      },
      error: (erro) => {
        this.mensagemService.mostrarErro('Erro ao carregar atividades');
        console.error('Erro ao carregar atividades:', erro);
        this.isLoading = false;
      }
    });
  }

  somaOrcamentoInicial: number = 0;
  somaOrcamentoAtualizado: number = 0;
  somaPrevisaoGastos: number = 0;
  somaDiferencaPrevista: number = 0;

  calcularTotais() {
    this.somaOrcamentoInicial = 0;
    this.somaOrcamentoAtualizado = 0;
    this.somaPrevisaoGastos = 0;
    this.somaDiferencaPrevista = 0;

    for (const atividade of this.atividades) {
      this.somaOrcamentoInicial += this.obterOrcamentoInicialAtividade(atividade);
      this.somaOrcamentoAtualizado += this.obterOrcamentoAtualizadoAtividade(atividade);
      this.somaPrevisaoGastos += this.obterPrevisaoDeGastosAtividade(atividade);
      this.somaDiferencaPrevista += this.obterDiferencaPrevistaAtividade(atividade);
    }
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.carregarAtividades(); // Recarregar para resetar a lista antes de filtrar
    this.atividades = this.atividades.filter(atividade =>
      atividade.NomeAtividade.toLowerCase().includes(filterValue) ||
      atividade.Descricao.toLowerCase().includes(filterValue)
    );
  }

  editarAtividade(atividade: Atividade) {
    this.router.navigateByUrl(`/gestao-orcamentaria/atividades/editar/${atividade.Id}`);
  }

  novaAtividade() {
    this.router.navigateByUrl('/gestao-orcamentaria/atividades/novo');
  }

  alternarLinhaExpandida(elemento: Atividade) {
    if (this.linhasExpandidas.has(elemento)) {
      this.linhasExpandidas.delete(elemento);
    } else {
      this.linhasExpandidas.add(elemento);
    }
  }

  estaExpandido(elemento: Atividade): boolean {
    return this.linhasExpandidas.has(elemento);
  }

  abrirModalItens(elemento: ElementoSubGrid) {
    this.modalAberto = true;
    this.itensModal = elemento.Itens || [];
  }

  fecharModal() {
    this.modalAberto = false;
    this.itensModal = [];
  }





  // Calculo de informações do grid de atividades:

  obterOrcamentoInicialAtividade(atividade: Atividade): number {
    const elementos = atividade.Elementos ?? [];

    const orcamentoInicialAtividade = elementos.reduce((soma, elemento) => {
      const orcamentoInicial = elemento.OrcamentoInicial ?? 0;
      return soma + orcamentoInicial;
    }, 0);

    return orcamentoInicialAtividade;
  }

  obterOrcamentoAtualizadoAtividade(atividade: Atividade): number {
    const elementos = atividade.Elementos ?? [];

    const orcamentoAtualizadoAtividade = elementos.reduce((soma, elemento) => {
      const orcamentoAtualizado = elemento.OrcamentoAtualizado ?? 0;
      return soma + orcamentoAtualizado;
    }, 0);

    return orcamentoAtualizadoAtividade;
  }

  obterPrevisaoDeGastosAtividade(atividade: Atividade): number {
    const elementos = atividade.Elementos ?? [];

    const previsaoGastosAtividade = elementos.reduce((soma, elemento) => {
      const somaItens = elemento.Itens?.reduce((subtotal, item) => {
        const valor = item.Valor;

        // Soma todos os campos de "Valor", exceto o "Total"
        const somaValor = Object.entries(valor)
          .filter(([chave]) => chave !== 'Total')
          .reduce((acc, [, val]) => acc + val, 0);

        return subtotal + somaValor;
      }, 0) ?? 0;

      return soma + somaItens;
    }, 0);

    return previsaoGastosAtividade;
  }

  obterDiferencaPrevistaAtividade(atividade: Atividade): number {
    const previsaoGastos = this.obterPrevisaoDeGastosAtividade(atividade);
    var orcamentoInicialAtividade = this.obterOrcamentoInicialAtividade(atividade)
    var orcamentoAtualizadoAtividade = this.obterOrcamentoAtualizadoAtividade(atividade)

    const diferencaPrevistaAtividade = orcamentoAtualizadoAtividade - previsaoGastos;

    return diferencaPrevistaAtividade;
  }

  // Calculo de informações do subGrid de elementos:

  obterPrevisaoDeGastosElemento(elemento: ElementoSubGrid): number {
    const somaPrevisaoGastosElemento = elemento.Itens?.reduce((soma, item) => {
      const valor = item.Valor;

      const somaValor = Object.entries(valor)
        .filter(([chave]) => chave !== 'Total')
        .reduce((acc, [, val]) => acc + val, 0);

      return soma + somaValor;
    }, 0) ?? 0;

    return somaPrevisaoGastosElemento;
  }

  obterDiferencaPrevistaElemento(elemento: ElementoSubGrid): number {
    const previsaoGastos = this.obterPrevisaoDeGastosElemento(elemento);

    const diferencaPrevistaElemento = elemento.OrcamentoAtualizado - previsaoGastos;

    return diferencaPrevistaElemento;
  }

}
