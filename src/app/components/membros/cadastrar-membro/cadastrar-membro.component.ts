import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SupabaseService } from '../../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastrar-membro',
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastrar-membro.component.html',
  styleUrl: './cadastrar-membro.component.scss'
})
export class CadastrarMembroComponent {
supabaseService = inject(SupabaseService);

  membro = {
    nome_completo: '',
    email: '',
    telefone: '',
    data_nascimento: '',
    sexo: '',
    endereco: '',
    funcao: '',
    data_entrada: ''
  };

  async criarMembro(form: NgForm) {
    if (form.valid) {
      try {
        await this.supabaseService.addMembro(this.membro);
        alert('Membro criado com sucesso!');
        form.resetForm();
      } catch (error) {
        console.error(error);
        alert('Erro ao criar membro.');
      }
    } else {
      alert('Preencha todos os campos obrigatórios.');
    }
  }
}