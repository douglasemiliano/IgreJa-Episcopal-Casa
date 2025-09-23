import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitariosService {

  private httpClient: HttpClient = inject(HttpClient);


  consultarCep(cep: string){
    return this.httpClient.get(`https://brasilapi.com.br/api/cep/v2/${cep}`)
  }
  
}
