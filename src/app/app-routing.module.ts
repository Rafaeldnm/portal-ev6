import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './core/pages/login/login.component';
import { RegistroComponent } from './core/pages/registro/registro.component';
import { InicioComponent } from './core/pages/inicio/inicio.component';
import { MinhaContaComponent } from './core/pages/minha-conta/minha-conta.component';
import { CategoriasComponent } from './gestao-investimentos-publicos/categorias/categorias.component';
import { InvestimentosComponent } from './gestao-investimentos-publicos/investimentos/investimentos.component';
import { GraficosComponent } from './gestao-investimentos-publicos/graficos/graficos.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'minha-conta', component: MinhaContaComponent, canActivate: [AuthGuard] },
  {
    path: 'gestao-investimentos-publicos',
    canActivate: [AuthGuard],
    children: [
      { path: 'categorias', component: CategoriasComponent },
      { path: 'investimentos', component: InvestimentosComponent },
      { path: 'graficos', component: GraficosComponent },
      { path: '', redirectTo: 'graficos', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
