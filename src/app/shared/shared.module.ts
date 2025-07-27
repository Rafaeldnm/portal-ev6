import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValorMaskDirective } from '../gestao-investimentos-publicos/directives/valor-mask.directive';

@NgModule({
  declarations: [ValorMaskDirective],
  imports: [CommonModule],
  exports: [ValorMaskDirective]
})
export class SharedModule { }
