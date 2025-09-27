import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-navbar-gestao-orcamentaria',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarGestaoOrcamentariaComponent implements OnInit {
  backUrl: string = '/inicio';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const currentUrl = this.route.snapshot.url.map((segment: UrlSegment) => segment.path).join('/');
    if (currentUrl.includes('editar')) {
      this.backUrl = '/gestao-orcamentaria/atividades';
    }
  }

  voltarParaInicio() {
    this.router.navigateByUrl(this.backUrl);
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
