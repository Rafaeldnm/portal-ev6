import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  rota: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  produtos: Produto[] = [
    {
      id: 'gestao-investimentos',
      nome: 'Gestão de Investimentos Públicos',
      descricao: 'Gerencie e monitore investimentos públicos com análises detalhadas e gráficos interativos.',
      icone: 'fas fa-chart-line',
      rota: '/gestao-investimentos-publicos/graficos'
    }
    // Novos produtos serão adicionados aqui
  ];

  usuario = this.authService.getCurrentUser();

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  navegarParaProduto(rota: string): void {
    this.router.navigate([rota]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
