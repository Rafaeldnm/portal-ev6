import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';

interface ElementoSubGrid {
  elemento: string;
  dotacao: string;
  ficha: string;
  recurso: string;
  orcamentoInicial: number;
  orcamentoAtualizado: number;
  previsaoGastosAno: number;
  diferencaPrevistaAno: number;
}

interface Atividade {
  id: number;
  nomeAtividade: string;
  descricao: string;
  ficha: string;
  orcamentoInicial: number;
  orcamentoAtualizado: number;
  previsaoGastosAno: number;
  diferencaPrevista: number;
  classificacao: 'Midia' | 'Obrigatorio';
  historico: string;
  fornecedor: string;
  gastoTotalAno: number;
  elementosSubGrid?: ElementoSubGrid[];
}

@Component({
  selector: 'app-atividades-grid',
  templateUrl: './atividades-grid.component.html',
  styleUrls: ['./atividades-grid.component.css']
})
export class AtividadesGridComponent implements OnInit {
  displayedColumns: string[] = [
    'expand',
    'nomeAtividade',
    'descricao',
    'orcamentoInicial',
    'orcamentoAtualizado',
    'previsaoGastosAno',
    'diferencaPrevista',
    'acoes'
  ];

  displayedColumnsSubGrid: string[] = [
    'elemento',
    'dotacao',
    'ficha',
    'recurso',
    'orcamentoInicial',
    'orcamentoAtualizado',
    'previsaoGastosAno',
    'diferencaPrevistaAno',
    'acoes'
  ];

  dataSource = new MatTableDataSource<Atividade>();
  linhasExpandidas: Set<Atividade> = new Set<Atividade>();

  // Mock data
  mockAtividades: Atividade[] = [
    {
      id: 1,
      nomeAtividade: 'Manutenção das Atividades das Unidades Básicas de Saúde',
      descricao: 'Manutenção e operação das UBS',
      ficha: '868',
      orcamentoInicial: 796000,
      orcamentoAtualizado: 796000,
      previsaoGastosAno: 796000,
      diferencaPrevista: 0,
      classificacao: 'Obrigatorio',
      historico: 'Despesas contínuas com UBS',
      fornecedor: 'Diversos',
      gastoTotalAno: 796000,
      elementosSubGrid: [
        {
          elemento: 'Elemento 1',
          dotacao: 'Dotação 1',
          ficha: 'Ficha 1',
          recurso: 'Recurso 1',
          orcamentoInicial: 100000,
          orcamentoAtualizado: 110000,
          previsaoGastosAno: 105000,
          diferencaPrevistaAno: 5000
        },
        {
          elemento: 'Elemento 2',
          dotacao: 'Dotação 2',
          ficha: 'Ficha 2',
          recurso: 'Recurso 2',
          orcamentoInicial: 200000,
          orcamentoAtualizado: 210000,
          previsaoGastosAno: 205000,
          diferencaPrevistaAno: 5000
        }
      ]
    },
    {
      id: 2,
      nomeAtividade: 'Publicidade e Marketing',
      descricao: 'Ações de comunicação',
      ficha: '875',
      orcamentoInicial: 50000,
      orcamentoAtualizado: 50000,
      previsaoGastosAno: 50000,
      diferencaPrevista: 0,
      classificacao: 'Midia',
      historico: 'Campanhas publicitárias',
      fornecedor: 'Agência XYZ',
      gastoTotalAno: 50000,
      elementosSubGrid: [
        {
          elemento: 'Elemento A',
          dotacao: 'Dotação A',
          ficha: 'Ficha A',
          recurso: 'Recurso A',
          orcamentoInicial: 25000,
          orcamentoAtualizado: 26000,
          previsaoGastosAno: 25500,
          diferencaPrevistaAno: 500
        }
      ]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    console.log('AtividadesGridComponent carregado');
    this.updateAtividadesSums();
    this.dataSource.data = this.mockAtividades;
  }

  updateAtividadesSums() {
    this.mockAtividades.forEach(atividade => {
      if (atividade.elementosSubGrid && atividade.elementosSubGrid.length > 0) {
        atividade.orcamentoInicial = atividade.elementosSubGrid.reduce((sum, el) => sum + el.orcamentoInicial, 0);
        atividade.orcamentoAtualizado = atividade.elementosSubGrid.reduce((sum, el) => sum + el.orcamentoAtualizado, 0);
        atividade.previsaoGastosAno = atividade.elementosSubGrid.reduce((sum, el) => sum + el.previsaoGastosAno, 0);
        atividade.diferencaPrevista = atividade.elementosSubGrid.reduce((sum, el) => sum + el.diferencaPrevistaAno, 0);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarAtividade(atividade: Atividade) {
    this.router.navigateByUrl(`/gestao-orcamentaria/atividades/editar/${atividade.id}`);
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
}
