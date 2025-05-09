import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MensagemService } from '../../../gestao-investimentos-publicos/services/mensagem.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email: '',
    senha: ''
  };
  loading = false;
  mostrarSenha = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mensagemService: MensagemService
  ) { }

  onSubmit(): void {
    if (!this.credentials.email || !this.credentials.senha) {
      this.mensagemService.mostrarErro('Por favor, preencha todos os campos');
      return;
    }

    this.loading = true;
    this.authService.login(this.credentials.email, this.credentials.senha)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/inicio']);
        },
        error: () => {
          this.loading = false;
          this.mensagemService.mostrarErro('Credenciais inválidas');
        }
      });
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  irParaRegistro(): void {
    this.router.navigate(['/registro']);
  }
}
