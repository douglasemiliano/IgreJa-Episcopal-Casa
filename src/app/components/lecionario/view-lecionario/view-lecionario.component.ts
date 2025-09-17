import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { SupabaseService } from '../../../services/supabase.service';
import { LecionarioService } from '../../../services/lecionario.service';
import { Conteudo } from '../../../model/Lecionario.model';

@Component({
  selector: 'app-lecionario',
  imports: [ FormsModule, CommonModule, DatePipe,MatButtonModule, MatIconModule, MatRippleModule, MatCardModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, OverlayModule],
  templateUrl: './view-lecionario.component.html',
  styleUrl: './view-lecionario.component.scss',
  standalone: true
})
export class ViewLecionarioComponent {
  selected: any;
  private lecionarioService: LecionarioService = inject(LecionarioService)
  private supabaseService = inject(SupabaseService);

  dataUnica: Date = this.lecionarioService.dataUnica();
  
  conteudoLecionario: Conteudo | null = null;

  isOpen = false;

  descricaoLecionario: string = "Esta ferramenta é organizada para nos conduzir a uma vida de disciplina espiritual e desfrutar do livre acesso proporcionado pela obra de Cristo. Não se trata apenas de interpretar textos, mas de aprender a ouvir Deus falar diretamente com você através da oração e leitura bíblica."
  liturgiaDiariaTitulo: string = "Liturgia Diária"
  
  liturgiaDiaria: string[] = ["Inicie com uma oração, pedindo ao Senhor que fale através de Sua Palavra e prepare seu coração para desfrutar de Sua presença.",
    "Faça uma ou todas as leituras indicadas (podendo usar as leituras em mais de um momento durante o dia, desde que se faça todas as leituras).", 
    "Ouça ou cante um louvor.", 
    "Conclua com a oração diária, utilizando-a como guia para refletir sobre o que buscar nesse momento."
  ] 
  
  constructor(private http: HttpClient){}

   ngOnInit(){
    this.getConteudoLecionario();
  }

  getConteudoLecionario(){
    console.log("Data selecionada: ", this.dataUnica);
    this.supabaseService.getLecionarioPorData(this.lecionarioService.dataUnica()).then((response) => {
      console.log(response);
      if(response.error){
        alert("Erro ao buscar o lecionário: " + response.error.message);    
        return;
      }
      this.conteudoLecionario = response.data![0]
    })
  }

   primeiraLetraMaiuscula(nome: string) {
    return nome.charAt(0).toUpperCase() + nome.substring(1);
  }

  incrementarDecrementarDia(increment: boolean): void {
    const dataAtual = this.dataUnica; // lê o valor atual
    const novaData = new Date(dataAtual); // cria uma nova cópia da data
    if (increment){
      novaData.setDate(novaData.getDate() + 1); // incrementa 1 dia
    } else {
      novaData.setDate(novaData.getDate() - 1); // decrementa 1 dia
    }
    this.dataUnica = novaData; // atualiza o signal

    this.lecionarioService.dataUnica.set(this.dataUnica);
    this.getConteudoLecionario();

  }

  onSelect(event:any){   
    this.dataUnica = event;
    this.lecionarioService.dataUnica.set(this.dataUnica);
    this.getConteudoLecionario();
    this.isOpen = false;
  }
  
  formatarTexto(){
    let texto: string = `${this.negritoWhatsapp(this.conteudoLecionario?.tempo + " - Dia: " + this.dataUnica.toLocaleDateString())}
    \n${this.negritoWhatsapp(this.conteudoLecionario?.nome!)}
    \n${this.descricaoLecionario}
    \n${this.negritoWhatsapp(this.liturgiaDiariaTitulo)}
    \n${this.liturgiaDiaria.map((item, index) => `${index+1}. ${item}`).join("\n")}
    \n${this.negritoWhatsapp("Textos Bíblicos")}
    \n${this.conteudoLecionario!.leituras.map((leitura: any) => `${this.primeiraLetraMaiuscula(leitura.tipo)}: ${leitura.texto}`).join("\n\n")}
    \n${this.negritoWhatsapp("Orações para o dia:")}
    \n${this.conteudoLecionario!.oracoes.map((oracao: any, index: number, arr: any[]) => index < arr.length - 1 ? `${oracao}\n\nou` : oracao).join("\n\n")}
    `;
    
    navigator.clipboard.writeText(texto).then(() => {
      alert('Lecionário copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar o texto: ', err);
    });
    
  }

  negritoWhatsapp(text: string): string{
    return `*${text}*`;
  }

}
