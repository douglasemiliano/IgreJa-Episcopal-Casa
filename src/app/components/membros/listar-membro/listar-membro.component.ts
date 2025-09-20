import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-membro',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './listar-membro.component.html',
  styleUrl: './listar-membro.component.scss'
})
export class ListarMembrosComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  membros: any[] = [];
  confirmacoes: { [key: string]: any[] } = {};

  ngOnInit() {
    this.carregarMembros();
  }


async carregarMembros() {
  try {
    const { data, error } = await this.supabaseService.getMembros();
    if (error) throw error;
    this.membros = data || [];

    console.log('Membros carregados:', this.membros);

    // Inicializa confirmacoes com arrays vazios para cada membro
    for (let membro of this.membros) {
      const { data: confs, error: err } = await this.supabaseService.getConfirmacoesPorMembro(membro.id);
      if (err) console.error(err);
      this.confirmacoes[membro.id] = confs || []; // nunca undefined
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar membros.');
  }
}

  async confirmarMembro(membro: any) {
    const dadosConfirmacao = {
      data_confirmacao: new Date(),
      oficiante: 'Pastor Fulano', // você pode deixar para preencher dinamicamente
      observacoes: ''
    };

    try {
      await this.supabaseService.confirmarMembro(membro.id, dadosConfirmacao);
      alert(`Membro ${membro.nome_completo} confirmado com sucesso!`);
      this.carregarMembros(); // Atualiza lista de confirmações
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar membro.');
    }
  }
}