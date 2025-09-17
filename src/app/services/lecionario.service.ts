import { Injectable, signal, WritableSignal } from '@angular/core';
import { LecionarioMock } from '../mocks/lecionario.mock';
import { Lecionario } from '../model/Lecionario.model';

@Injectable({
  providedIn: 'root'
})
export class LecionarioService {

  public dataUnica: WritableSignal<Date> = signal<Date>(new Date());
  public lecionarioSelecionado: WritableSignal<Lecionario> = signal<any>(null);

  setLecionarioSelecionado(lecionario: Lecionario | null) {
    this.lecionarioSelecionado.set(lecionario!);
  }

  getConteudoPorData(date: Date) {
    if (!this.dataUnica) return;

    let data: string | Date = date;

    if (typeof date === 'object') {
      data = this.formatDate(date);
    }

    const ano = 'C'; // você pode tornar isso dinâmico se quiser
    const lecionario = LecionarioMock.find(l => l.ano === ano);

    const diaEncontrado = lecionario!.conteudo.find(item => item.dia === data);

    return diaEncontrado!;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // retorna yyyy-mm-dd
  }


}
