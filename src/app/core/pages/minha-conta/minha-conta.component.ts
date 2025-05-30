import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-minha-conta',
  templateUrl: './minha-conta.component.html',
  styleUrls: ['./minha-conta.component.css']
})
export class MinhaContaComponent implements OnInit {
  perfilForm: FormGroup;
  senhaForm: FormGroup;
  mostrarSenhaAtual = false;
  mostrarNovaSenha = false;
  mostrarConfirmarSenha = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.perfilForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    }, { validator: this.confirmarSenhaValidator });
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.perfilForm.patchValue({
        nome: user.nome
      });
    }
  }

  confirmarSenhaValidator(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    return novaSenha === confirmarSenha ? null : { senhasNaoConferem: true };
  }

  atualizarPerfil() {
    if (this.perfilForm.valid) {
      this.loading = true;
      this.authService.atualizarPerfil(this.perfilForm.value).subscribe({
        next: () => {
          this.loading = false;
          // Atualizar informações do usuário no localStorage
          const user = this.authService.getCurrentUser();
          if (user) {
            user.nome = this.perfilForm.value.nome;
            localStorage.setItem('user', JSON.stringify(user));
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar perfil:', error);
        }
      });
    }
  }

  atualizarSenha() {
    if (this.senhaForm.valid) {
      this.loading = true;
      this.authService.atualizarSenha(this.senhaForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.senhaForm.reset();
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar senha:', error);
        }
      });
    }
  }

  toggleSenha(campo: string) {
    switch (campo) {
      case 'atual':
        this.mostrarSenhaAtual = !this.mostrarSenhaAtual;
        break;
      case 'nova':
        this.mostrarNovaSenha = !this.mostrarNovaSenha;
        break;
      case 'confirmar':
        this.mostrarConfirmarSenha = !this.mostrarConfirmarSenha;
        break;
    }
  }

  voltarInicio() {
    this.router.navigate(['/inicio']);
  }
}
