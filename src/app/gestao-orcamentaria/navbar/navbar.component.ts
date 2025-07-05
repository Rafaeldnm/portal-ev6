import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-gestao-orcamentaria',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarGestaoOrcamentariaComponent {
  constructor(private router: Router) {}

  voltarParaInicio() {
    this.router.navigateByUrl('/inicio');
  }

  navegarParaAtividades() {
    this.router.navigateByUrl('/gestao-orcamentaria/atividades');
  }

  navegarParaRelatorios() {
    this.router.navigateByUrl('/gestao-orcamentaria/relatorios');
  }

  navegarParaDashboard() {
    this.router.navigateByUrl('/gestao-orcamentaria/dashboard');
  }
}
