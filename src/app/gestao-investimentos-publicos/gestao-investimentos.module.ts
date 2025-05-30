import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoriasComponent } from './categorias/categorias.component';
import { InvestimentosComponent } from './investimentos/investimentos.component';
import { GraficosComponent } from './graficos/graficos.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ValorMaskDirective } from './directives/valor-mask.directive';

@NgModule({
  declarations: [
    CategoriasComponent,
    InvestimentosComponent,
    GraficosComponent,
    NavbarComponent,
    ValorMaskDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CategoriasComponent,
    InvestimentosComponent,
    GraficosComponent,
    NavbarComponent,
    ValorMaskDirective
  ]
})
export class GestaoInvestimentosModule { }
