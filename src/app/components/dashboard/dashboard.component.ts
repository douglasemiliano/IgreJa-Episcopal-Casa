import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  imports: [DatePipe, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  totalMembros: number = 0;
  totalLecionarios: number = 0;
  totalConfirmacoes: number = 0;
  ultimosMembros: any[] = [];
  loading: boolean = true;

  displayedColumns: string[] = ['nome_completo', 'data_entrada', 'email', 'telefone', 'confirmado'];

  private supabaseService = inject(SupabaseService);

  async ngOnInit() {

    this.loading = true;

    // Buscar membros
    const { data: membros } = await this.supabaseService.getMembrosComConfirmacao();
    if (membros) {
      this.totalMembros = membros.length;
      this.ultimosMembros = membros.slice(-5).reverse(); // pega os 5 últimos
      console.log('Últimos membros:', this.ultimosMembros);
    }

    // Buscar lecionarios
    const { data: lecionarios } = await this.supabaseService.getTodosLectionary();
    if (lecionarios) {
      this.totalLecionarios = lecionarios.length;
    }

    // Buscar confirmações
    const { data: confirmacoes } = await this.supabaseService.getConfirmacoes();
    if (confirmacoes) {
      this.totalConfirmacoes = confirmacoes.length;
    }

    this.loading = false;
  }
}