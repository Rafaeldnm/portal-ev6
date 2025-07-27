import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoriasComponent } from './categorias/categorias.component';
import { InvestimentosComponent } from './investimentos/investimentos.component';
import { GraficosComponent } from './graficos/graficos.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CategoriasComponent,
    InvestimentosComponent,
    GraficosComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    CategoriasComponent,
    InvestimentosComponent,
    GraficosComponent,
    NavbarComponent
  ]
})
export class GestaoInvestimentosModule { }
