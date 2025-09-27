import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarGestaoOrcamentariaComponent } from './navbar/navbar.component';
import { AtividadesGridComponent } from './atividades/atividades-grid/atividades-grid.component';
import { AtividadeEditComponent } from './atividades/atividade-edit/atividade-edit.component';
import { ItemModalComponent } from './atividades/item-modal/item-modal.component';
import { ItemVisualizarModalComponent } from './atividades/item-visualizar-modal/item-visualizar-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardComponent } from 'src/app/gestao-orcamentaria/dashboard/dashboard.component';
import { GestaoOrcamentariaRoutingModule } from './gestao-orcamentaria-routing.module';
import { SharedModule } from '../shared/shared.module';
import { IConfig, NgxMaskModule } from 'ngx-mask';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    NavbarGestaoOrcamentariaComponent,
    AtividadesGridComponent,
    AtividadeEditComponent,
    DashboardComponent,
    ItemModalComponent,
    ItemVisualizarModalComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatNativeDateModule,
    GestaoOrcamentariaRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot(maskConfig)

  ],
  exports: [
    NavbarGestaoOrcamentariaComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GestaoOrcamentariaModule { }
