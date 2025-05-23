import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core
import { LoginComponent } from './core/pages/login/login.component';
import { RegistroComponent } from './core/pages/registro/registro.component';
import { InicioComponent } from './core/pages/inicio/inicio.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

// Gestão de Investimentos Públicos
import { CategoriasComponent } from './gestao-investimentos-publicos/categorias/categorias.component';
import { InvestimentosComponent } from './gestao-investimentos-publicos/investimentos/investimentos.component';
import { GraficosComponent } from './gestao-investimentos-publicos/graficos/graficos.component';
import { NavbarComponent } from './gestao-investimentos-publicos/navbar/navbar.component';
import { MensagemComponent } from './gestao-investimentos-publicos/components/mensagem/mensagem.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    CategoriasComponent,
    InvestimentosComponent,
    GraficosComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MensagemComponent // Importado como módulo por ser standalone
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
