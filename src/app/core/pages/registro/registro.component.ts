import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MensagemService } from '../../../gestao-investimentos-publicos/services/mensagem.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  };
  loading = false;
  mostrarSenha = false;
  mostrarConfirmarSenha = false;

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
    this.authService.registro(this.usuario)
      .subscribe({
        next: () => {
          this.loading = false;
          this.mensagemService.mostrarSucesso('Registro realizado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (erro) => {
          this.loading = false;
          this.mensagemService.mostrarErro(erro.message || 'Erro ao realizar registro');
        }
      });
  }

  private validarFormulario(): boolean {
    if (!this.usuario.nome || !this.usuario.email || !this.usuario.senha || !this.usuario.confirmarSenha) {
      this.mensagemService.mostrarErro('Por favor, preencha todos os campos');
      return false;
    }

    if (this.usuario.senha !== this.usuario.confirmarSenha) {
      this.mensagemService.mostrarErro('As senhas não coincidem');
      return false;
    }

    if (this.usuario.senha.length < 6) {
      this.mensagemService.mostrarErro('A senha deve ter no mínimo 6 caracteres');
      return false;
    }

    return true;
  }

  toggleSenha(campo: 'senha' | 'confirmarSenha'): void {
    if (campo === 'senha') {
      this.mostrarSenha = !this.mostrarSenha;
    } else {
      this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
    }
  }

  voltarParaLogin(): void {
    this.router.navigate(['/login']);
  }
}
