import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';

import { DashboardComponent } from './dashboard/dashboard.component';

// Import new components
import { AtividadesGridComponent } from './atividades/atividades-grid/atividades-grid.component';
import { AtividadeEditComponent } from './atividades/atividade-edit/atividade-edit.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'atividades', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'atividades', component: AtividadesGridComponent },
      { path: 'atividades/novo', component: AtividadeEditComponent },
      { path: 'atividades/editar/:id', component: AtividadeEditComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoOrcamentariaRoutingModule { }
