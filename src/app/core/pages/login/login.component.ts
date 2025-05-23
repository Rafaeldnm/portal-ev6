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
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    this.authService.login(this.credentials.email, this.credentials.senha)
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.token) {
            this.mensagemService.mostrarSucesso('Login realizado com sucesso!');
            this.router.navigate(['/inicio']);
          } else {
            this.mensagemService.mostrarErro('Resposta inválida do servidor');
          }
        },
        error: (error) => {
          this.loading = false;
          let mensagemErro = 'Erro ao realizar login';

          if (error.error?.mensagem) {
            mensagemErro = error.error.mensagem;
          } else if (error.status === 401) {
            mensagemErro = 'Email ou senha inválidos';
          } else if (error.status === 0) {
            mensagemErro = 'Erro de conexão com o servidor';
          }

          this.mensagemService.mostrarErro(mensagemErro);
        }
      });
  }

  private validarFormulario(): boolean {
    if (!this.credentials.email || !this.credentials.senha) {
      this.mensagemService.mostrarErro('Por favor, preencha todos os campos');
      return false;
    }

    if (this.credentials.senha.length < 6) {
      this.mensagemService.mostrarErro('A senha deve ter no mínimo 6 caracteres');
      return false;
    }

    return true;
  }

  toggleSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  irParaRegistro(): void {
    this.router.navigate(['/registro']);
  }
}
