import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LecionarioResponse } from '../../../model/Lecionario.model';
import { SupabaseService } from '../../../services/supabase.service';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LecionarioService } from '../../../services/lecionario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalConfirmacaoService } from '../../utils/modal-confirmacao/modal-confirmacao.service';


@Component({
  selector: 'app-listar-lecionario',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './listar-lecionario.component.html',
  styleUrl: './listar-lecionario.component.scss',
  standalone: true
})
export class ListarLecionarioComponent {
  colunas: string[] = ['dia', 'nome', 'ano_liturgico', 'acoes'];
  dataSourceLecionario: MatTableDataSource<LecionarioResponse>;
  pageSize = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private supabaseService: SupabaseService, 
    private snackbar: MatSnackBar,
    private lecionarioService: LecionarioService, private router: Router,
    private modalService: ModalConfirmacaoService) { 
    this.recuperarLecionario();
  }

  recuperarLecionario(){
    this.supabaseService.getLecionarioPorAnoLiturgico("C").then((response) => {
      this.dataSourceLecionario = new MatTableDataSource(response.data!)
      this.dataSourceLecionario.paginator = this.paginator;
      this.dataSourceLecionario.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLecionario.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceLecionario.paginator) {
      this.dataSourceLecionario.paginator.firstPage();
    }
  }

  editar(lecionario: any) {
    this.lecionarioService.setLecionarioSelecionado(lecionario);
    this.router.navigateByUrl('/lecionario/cadastro');
  }
  goToCadastro(){
    this.lecionarioService.setLecionarioSelecionado(null);
    this.router.navigateByUrl("/lecionario/cadastro")
  }

  async delete(id: string) {

    this.modalService.confirmar('Deseja realmente excluir este registro?').then(async (confirmado) => {
      if (confirmado) {
        // Usuário clicou em "Sim"
        const { error } = await this.supabaseService.deleteLectionary(id);
          if (error) {
            this.snackbar.open('Erro ao excluir o registro.', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error']
            });
          } else {
            this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-success']
            });
      
            this.recuperarLecionario();
          }
        
      } else {
        // Usuário clicou em "Não"
        console.log('Exclusão cancelada.');
      }
    });
  }

  handlePageEvent(e: PageEvent) {  
    this.pageSize = e.pageSize;
  }
  
  
}
