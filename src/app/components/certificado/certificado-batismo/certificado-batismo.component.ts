import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CertificadoBatismoService } from '../../../services/certificados/certificado-batismo.service';
import { DadosCertificado } from '../../../model/certificado.model';
import { PdfViewerModalComponent } from '../certificado-confirmacao/pdf-viewer-modal/pdf-viewer-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificado-batismo',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, CommonModule],
  templateUrl: './certificado-batismo.component.html',
  styleUrl: './certificado-batismo.component.scss'
})
export class CertificadoBatismoComponent {
  formulario: FormGroup;
  currentStep = 1;
  ministros = [
    'Elton Nascimento',
    'Marcos Santos',
    'Bispo Hermany Soares',
    'Reverendo Ielvys'
  ];

  constructor(
    private fb: FormBuilder,
    private certificadoService: CertificadoBatismoService,
    private dialog: MatDialog
  ) {
    this.formulario = this.fb.group({
      tipoPessoa: ['', Validators.required],
      nomeCompleto: ['Giovanna Nicole Daniela da Rosa', Validators.required],
      dataBatismo: ['11/08/2003', Validators.required],
      igrejaBatismo: ['Igreja Episcopal Casa', Validators.required],
      paroco: ['Elton Nascimento', Validators.required],
      padrinhos: ['Maria Eduarda Neves, Arthur Fonseca Neves'],
      dataNascimento: [''],
      nomePais: [''],
      nomeMae:['Ana Tatiane da Rosa',],
      nomePai:['Roberto Augusto da Rosa',],
      naturalidade: [''],
      numeroRegistro: [''],
      localCelebracao: ['Rua Arão Lins de Andrade, 106, Jaboatão dos Guararapes 54310-335, PE'],
      diocese: ['Episcopal Unida do Brasil'],
      bispo: ['Hermany Soares', Validators.required]
    });
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async onSubmit() {
    if (this.formulario.valid) {
      const dados: DadosCertificado = {
        ...this.formulario.value,
        dataBatismo: new Date(this.formulario.value.dataBatismo),
        dataNascimento: this.formulario.value.dataNascimento ? 
                       new Date(this.formulario.value.dataNascimento) : undefined,
        padrinhos: this.formulario.value.padrinhos ? 
                  this.formulario.value.padrinhos.split(',').map((s: string) => s.trim()) : []
      };

      console.log(dados)
      
      try {
        const pdfBlob = await this.certificadoService.gerarCertificado(dados);
        const fileName = this.certificadoService.getNomeArquivo(dados.nomeCompleto);
        
        this.dialog.open(PdfViewerModalComponent, {
          width: '80vw',
          data: { pdfBlob, fileName }
        });
      } catch (error) {
        console.error('Erro ao gerar certificado:', error);
        alert('Erro ao gerar o certificado. Por favor, tente novamente.');
      }
    }
  }
}
