import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmacaoComponent } from './modal-confirmacao.component';

@Injectable({
  providedIn: 'root',
})
export class ModalConfirmacaoService {
  constructor(private dialog: MatDialog) {}

  confirmar(mensagem: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ModalConfirmacaoComponent, {
      width: '300px',
      data: { mensagem },
      disableClose: true,
    });

    return dialogRef.afterClosed().toPromise();
  }
}
