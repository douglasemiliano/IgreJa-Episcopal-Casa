import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DadosCertificado } from '../../../model/certificado.model';
import { CertificadoConfirmacaoService } from '../../../services/certificado-confirmacao.service';

@Component({
  selector: 'app-certificado-confirmacao',
  imports: [ReactiveFormsModule],
  templateUrl: './certificado-confirmacao.component.html',
  styleUrl: './certificado-confirmacao.component.scss'
})
export class CertificadoConfirmacaoComponent {
formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private certificadoService: CertificadoConfirmacaoService
  ) {
    this.formulario = this.fb.group({
      nomeCompleto: ['', Validators.required],
      dataConfirmacao: ['', Validators.required],
      igreja: ['', Validators.required],
      diocese: ['', Validators.required],
      paroco: [''],
      bispo: ['', Validators.required],
      numeroRegistro: [''],
      padrinhos: [''],
      localCelebracao: ['Rua Arão Lins de Andrade, 106, Jaboatão dos Guararapes 54310-335, PE'],
      dataNascimento: [''],
      nomePais: [''],
      naturalidade: [''],
      dataBatismo: [''],
      igrejaBatismo: ['']
    });

    this.formulario.get('localCelebracao')?.disable();
  }

  async onSubmit() {
    if (this.formulario.valid) {
      const dados: DadosCertificado = {
        ...this.formulario.value,
        dataConfirmacao: new Date(this.formulario.value.dataConfirmacao),
        dataNascimento: this.formulario.value.dataNascimento ? 
                       new Date(this.formulario.value.dataNascimento) : undefined,
        dataBatismo: this.formulario.value.dataBatismo ? 
                    new Date(this.formulario.value.dataBatismo) : undefined,
        padrinhos: this.formulario.value.padrinhos ? 
                  this.formulario.value.padrinhos.split(',').map((s: string) => s.trim()) : []
      };
      
      try {
        await this.certificadoService.gerarCertificado(dados);
      } catch (error) {
        console.error('Erro ao gerar certificado:', error);
        alert('Erro ao gerar o certificado. Por favor, tente novamente.');
      }
    }
  }
}
