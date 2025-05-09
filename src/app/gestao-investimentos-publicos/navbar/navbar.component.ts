import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(public router: Router) { }

  navegarParaCategorias() {
    this.router.navigate(['/gestao-investimentos-publicos/categorias']);
  }

  navegarParaInvestimentos() {
    this.router.navigate(['/gestao-investimentos-publicos/investimentos']);
  }

  navegarParaGraficos() {
    this.router.navigate(['/gestao-investimentos-publicos/graficos']);
  }

  voltarParaInicio() {
    this.router.navigate(['/inicio']);
  }

  isRotaAtiva(rota: string): boolean {
    return this.router.url.includes(rota);
  }
}
