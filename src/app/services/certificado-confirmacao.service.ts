import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { DadosCertificado } from '../model/certificado.model';


@Injectable({
  providedIn: 'root'
})
export class CertificadoConfirmacaoService {
  
  private readonly larguraPagina = 297;  // A4 paisagem
  private readonly alturaPagina = 210;
  private readonly logoWidth = 30;  // Largura das logos em mm
  private readonly logoHeight = 30; // Altura das logos em mm
  private readonly margin = 20;     // Margem em mm

  private carregarImagem(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }

  private converterParaBase64(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0);
    return canvas.toDataURL('image/png');
  }

  async gerarCertificado(dados: DadosCertificado): Promise<void> {
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Configuração da página
    doc.setFont('times', 'Roman');
    
    // Adiciona a imagem de fundo
    doc.addImage("fundo2.jpg", 'JPEG', 0, 0, this.larguraPagina, this.alturaPagina);
    doc.addImage("casa.png", 'PNG', this.margin, this.margin, this.logoWidth, this.logoHeight);
    
    // Texto da Trindade entre as logos
    doc.setFontSize(14);
    doc.setFont('times', 'Italic');
    const textoTrindade = [
      'Em nome do Pai, e do Filho, e do Espírito Santo',
       'Amém.'
    ];
    const espacamentoLinhas = 6; // espaçamento entre as linhas em mm
    textoTrindade.forEach((linha, index) => {
      doc.text(linha, this.larguraPagina / 2, this.margin + (index * espacamentoLinhas) + 10, { align: 'center' });
    });
    doc.setFont('times', 'Roman'); // Restaura a fonte padrão
    
    doc.addImage("diocese.png", 'PNG', 
        this.larguraPagina - this.margin - this.logoWidth, 
        this.margin, 
        this.logoWidth, 
        this.logoHeight
      );

    // Cabeçalho
    doc.setFontSize(24);
    doc.text('IGREJA EPISCOPAL UNIDA DO BRASIL', this.larguraPagina / 2, this.margin + this.logoHeight + 10, { align: 'center' });
    
    // Título
    doc.setFontSize(46);
    doc.text('Certificado de Confirmação', this.larguraPagina / 2, this.margin + this.logoHeight + 45, { align: 'center' });

    // Texto principal
    doc.setFontSize(16);
    let textosPrincipais = [];
    
    // Dados pessoais
    if (dados.dataNascimento && dados.nomePais && dados.naturalidade) {
      doc.setFont('times', 'bold');
      const nomeCompleto = dados.nomeCompleto;
      doc.setFont('times', 'roman');
      textosPrincipais.push(
        'Certificamos que ' + nomeCompleto + ', natural de ' + dados.naturalidade + 
        ', nascido(a) em ' + this.formatarData(dados.dataNascimento) + 
        ', filho(a) de ' + dados.nomePais + ','
      );
    } else {
      const nomeCompleto =  dados.nomeCompleto;
      textosPrincipais.push('Certificamos que ' + nomeCompleto);
    }

    // Dados do batismo
    if (dados.dataBatismo && dados.igrejaBatismo) {
      textosPrincipais.push(
        'batizado(a) em ' + this.formatarData(dados.dataBatismo) + 
        ' na Igreja ' + dados.igrejaBatismo + ','
      );
    }

    // Dados da confirmação
    const nomeBispo = dados.bispo;
    textosPrincipais.push(
      'recebeu o rito apostólico da Confirmação no dia ' + this.formatarData(dados.dataConfirmacao) + 
      ', na Igreja ' + dados.igreja + ', Diocese ' + dados.diocese + 
      ', pela imposição das mãos do Reverendo Bispo ' + nomeBispo + '.'
    );

    const textoCompleto = textosPrincipais.join(' ');
    const linhasTexto = doc.splitTextToSize(textoCompleto, 250);
    doc.text(linhasTexto, this.larguraPagina / 2, this.margin + this.logoHeight + 70, { align: 'center' });

    // Padrinhos e Madrinhas
    if (dados.padrinhos && dados.padrinhos.length > 0) {
      doc.setFontSize(14);
      doc.text('Padrinhos e Madrinhas:', this.larguraPagina / 2, 130, { align: 'center' });
      doc.text(dados.padrinhos.join(', '), this.larguraPagina / 2, 140, { align: 'center' });
    }

    // Número de Registro no canto inferior esquerdo
    doc.setFontSize(12);
    const textoRegistro = 'Livro ' + (dados.livroRegistro || '___') + 
                         ', Página ' + (dados.paginaRegistro || '___') + 
                         ', Nº ' + (dados.numeroRegistro || '___');
    doc.text(textoRegistro, this.margin, this.alturaPagina - 15);

    // Data e Local
    doc.setFontSize(14);
    const localData = 'Jaboatão dos Guararapes, ' + this.formatarData(dados.dataConfirmacao);
    doc.text(localData, this.larguraPagina / 2, this.alturaPagina - 50, { align: 'center' });

    // Assinaturas
    doc.line(50, this.alturaPagina - 35, 120, this.alturaPagina - 35);
    doc.line(180, this.alturaPagina - 35, 250, this.alturaPagina - 35);
    doc.setFontSize(12);
    doc.text('Pároco', 85, this.alturaPagina - 30, { align: 'center' });
    doc.text('Bispo Diocesano', 215, this.alturaPagina - 30, { align: 'center' });

    // Download do arquivo
    const nomeArquivo = 'certificado-confirmacao-' + 
                       dados.nomeCompleto.toLowerCase().replace(/\s+/g, '-') + '.pdf';
    doc.save(nomeArquivo);
  }

  private formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}