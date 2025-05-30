import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  usuario: User | null = null;
  isDropdownOpen = false;
  produtos = [
    {
      nome: 'Gestão de Investimentos Públicos',
      descricao: 'Gerencie e monitore investimentos públicos com análises detalhadas e gráficos interativos.',
      icone: 'fas fa-chart-line',
      rota: '/gestao-investimentos-publicos'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.usuario = this.authService.getCurrentUser();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navegarParaMinhaConta() {
    this.isDropdownOpen = false;
    this.router.navigate(['/minha-conta']);
  }

  navegarParaProduto(rota: string) {
    this.router.navigate([rota]);
  }

  logout() {
    this.isDropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Fecha o dropdown quando clicar fora dele
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.dropdown');
    const btnOptions = document.querySelector('.btn-options');

    if (dropdown && !dropdown.contains(target) && btnOptions && !btnOptions.contains(target)) {
      this.isDropdownOpen = false;
    }
  }
}
