import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { AtividadesService } from '../../services/atividades.service';
import { Atividade } from '../../models/atividade.model';
import { MensagemService } from 'src/app/gestao-investimentos-publicos/services/mensagem.service';

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

  dataSource = new MatTableDataSource<Atividade>();

  // atividades: Atividade[] = [
  //   {
  //     id: 1,
  //     nomeAtividade: 'Campanha Publicitária',
  //     descricao: 'Campanha institucional no primeiro semestre',
  //     ficha: '123',
  //     orcamentoInicial: 100000,
  //     orcamentoAtualizado: 120000,
  //     previsaoGastosAno: 110000,
  //     diferencaPrevista: 10000,
  //     classificacao: 'Midia',
  //     historico: 'Campanha aprovada em abril',
  //     fornecedor: 'Agência XYZ',
  //     gastoTotalAno: 105000,
  //     elementosSubGrid: [
  //       {
  //         elemento: 'Vídeo',
  //         descricao: 'Produção de vídeo institucional',
  //         ficha: '123-A',
  //         recurso: 'Vídeo Maker',
  //         orcamentoInicial: 40000,
  //         orcamentoAtualizado: 45000,
  //         previsaoGastosAno: 42000,
  //         diferencaPrevistaAno: 3000,
  //         itens: []
  //       }
  //     ]
  //   },
  //   // ...outros elementos
  // ];

  atividades: Atividade[] = [];
  linhasExpandidas: Set<Atividade> = new Set<Atividade>();

  modalAberto: boolean = false;
  itensModal: any[] = [];

  constructor(private router: Router,
    private atividadesService: AtividadesService,
    private mensagemService: MensagemService
    ) {}

  ngOnInit() {
    this.carregarAtividades();
  }

  carregarAtividades() {
    this.atividadesService.listarAtividades().subscribe({
      next: (atividades) => {
        this.atividades = atividades;
        console.log(atividades);
      },
      error: (erro) => {
        this.mensagemService.mostrarErro('Erro ao carregar categorias');
        console.error('Erro ao carregar categorias:', erro);
      }
    });
  }


  // carregarAtividades() {
  //   const atividades = this.atividadesService.recuperarAtividades();
  //   if (atividades. === 0) {
  //     // Se não houver dados no localStorage, pode-se inicializar com dados padrão ou vazio
  //     this.dataSource.data = [];
  //   } else {
  //     this.dataSource.data = atividades;
  //   }
  //   this.updateAtividadesSums();
  // }

  updateAtividadesSums() {
    this.atividades.forEach(atividade => {
      if (atividade.Elementos && atividade.Elementos.length > 0) {
        atividade.OrcamentoInicial = atividade.Elementos.reduce((sum, el) => sum + el.OrcamentoInicial, 0);
        atividade.OrcamentoAtualizado = atividade.Elementos.reduce((sum, el) => sum + el.OrcamentoAtualizado, 0);
        atividade.PrevisaoGastosAno = atividade.Elementos.reduce((sum, el) => sum + el.PrevisaoGastosAno, 0);
        atividade.DiferencaPrevista = atividade.Elementos.reduce((sum, el) => sum + el.DiferencaPrevistaAno, 0);
      }
    });
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

  abrirModalItens(elemento: any) {
    this.modalAberto = true;
    this.itensModal = elemento.itens || [];
  }

  fecharModal() {
    this.modalAberto = false;
    this.itensModal = [];
  }

  atualizarItens(itensAtualizados: any[]) {
    // Atualize os itens conforme necessário, por exemplo, atualizar o localStorage via serviço
    console.log('Itens atualizados:', itensAtualizados);
    this.fecharModal();
  }

  obterOrcamentoInicialAtividade(atividade: Atividade): number {
    const elementos = atividade.Elementos ?? [];

    const somaOrcamentos = elementos.reduce((soma, elemento) => {
      const orcamentoInicial = elemento.OrcamentoInicial ?? 0;
      return soma + orcamentoInicial;
    }, 0);

    return somaOrcamentos;
  }

  obterOrcamentoAtualizadoAtividade(atividade: Atividade): number {
    const elementos = atividade.Elementos ?? [];

    const somaOrcamentos = elementos.reduce((soma, elemento) => {
      const orcamentoAtualizado = elemento.OrcamentoAtualizado ?? 0;
      return soma + orcamentoAtualizado;
    }, 0);

    return somaOrcamentos;
  }

}
