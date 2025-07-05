import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core
import { LoginComponent } from './core/pages/login/login.component';
import { RegistroComponent } from './core/pages/registro/registro.component';
import { InicioComponent } from './core/pages/inicio/inicio.component';
import { MinhaContaComponent } from './core/pages/minha-conta/minha-conta.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Feature Modules
import { GestaoInvestimentosModule } from './gestao-investimentos-publicos/gestao-investimentos.module';
import { GestaoOrcamentariaModule } from './gestao-orcamentaria/gestao-orcamentaria.module';

// Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Standalone Components
import { MensagemComponent } from './gestao-investimentos-publicos/components/mensagem/mensagem.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    MinhaContaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    GestaoInvestimentosModule,
    GestaoOrcamentariaModule,
    MensagemComponent, // Importando o componente standalone
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
