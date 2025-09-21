import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import { DadosCertificado } from '../../model/certificado.model';

@Injectable({
  providedIn: 'root'
})
export class CertificadoBatismoService {

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

  async gerarCertificado(dados: DadosCertificado): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Configuração da página
    doc.setFont('times', 'Roman');
    
    // Adiciona a imagem de fundo
    if(dados.tipoPessoa === "adulto"){
      doc.addImage("fundo2.jpg", 'JPEG', 0, 0, this.larguraPagina, this.alturaPagina);
    } else {
      doc.addImage("batismo.png", 'PNG', 0, 0, this.larguraPagina, this.alturaPagina);
    }

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
    doc.text('IGREJA EPISCOPAL CASA', this.larguraPagina / 2, this.margin + this.logoHeight + 10, { align: 'center' });
    
    // Título
    doc.setFontSize(46);
    doc.text('Certificado de Batismo', this.larguraPagina / 2, this.margin + this.logoHeight + 35, { align: 'center' });

    // Texto principal - renderizado em blocos para permitir o nome em negrito
    doc.setFontSize(16);
    let currentY = this.margin + this.logoHeight + 55;
    let confirmacaoConcatenada = false;
    
    // Dados pessoais
    const nomeBispo = dados.bispo;
    if (dados.dataNascimento && dados.nomePais && dados.naturalidade) {
      // ... (código existente para dados pessoais detalhados)
    } else {
      const textParts = [
        { text: 'Certificamos que ', bold: false, size: 16 },
        { text: dados.nomeCompleto || '', bold: true, size: 20 },
        { text: ', Filho(a) de ', bold: false, size: 16 },
        { text: dados.nomePai || '', bold: false, size: 16 },
        { text: dados.nomePai ? ' e ' : '', bold: false, size: 16 },
        { text: dados.nomeMae || '', bold: false, size: 16},
        { text: ', foi batizado(a) no dia ' + this.formatarData(dados.dataBatismo!) +
               ', na Igreja ' + dados.igrejaBatismo + ', Diocese ' + dados.diocese + ', ', bold: false, size: 16 },
        { text: 'em nome do Pai, do Filho e do Espírito Santo', bold: true, size: 16 },
        { text: ', conforme mandamento do ', bold: false, size: 16 },
        { text: 'Senhor Jesus Cristo.', bold: true, size: 16 },
        // { text: ' pelo Reverendo Bispo ' + nomeBispo + '.', bold: false, size: 16 }
      ];
      
      currentY = this.renderStyledText(doc, textParts, currentY, 8, this.larguraPagina - (2 * this.margin));
      confirmacaoConcatenada = true;
    }

    // Dados da confirmação
    if (!confirmacaoConcatenada) {
      const confirmacaoText = 'recebeu o rito apostólico da Confirmação no dia ' + this.formatarData(dados.dataBatismo!) + ', na Igreja ' + dados.igreja + ', Diocese ' + dados.diocese + ', pela imposição das mãos do Reverendo Bispo ' + nomeBispo + '.';
      const linhasConfirm = doc.splitTextToSize(confirmacaoText, 250);
      doc.text(linhasConfirm, this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += linhasConfirm.length * 7;
    }

    // Padrinhos e Madrinhas
    if (dados.padrinhos && dados.padrinhos.length > 0) {
      currentY += 5; // Espaçamento para não sobrepor o texto de cima
      doc.setFontSize(14);
      doc.text('Padrinhos:', this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += 7;
      
      doc.setFont('times', 'regular');
      const linhasPadrinhos = doc.splitTextToSize(dados.padrinhos.join(', '), 250);
      doc.text(linhasPadrinhos, this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += linhasPadrinhos.length * 7;
    }

    // Posição do bloco de data e assinaturas, garantindo que não suba demais na página.
    let bottomBlockY = Math.max(currentY + 10, this.alturaPagina - 60);

    // Número de Registro no canto inferior esquerdo
    doc.setFontSize(12);
    const textoRegistro = 'Livro ' + (dados.livroRegistro || '___') + 
                         ', Página ' + (dados.paginaRegistro || '___') + 
                         ', Nº ' + (dados.numeroRegistro || '___');
    doc.text(textoRegistro, this.margin, this.alturaPagina - 15);

    // Data e Local
    doc.setFontSize(14);
    const localData = 'Jaboatão dos Guararapes, ' + this.formatarData(dados.dataBatismo!);
    doc.text(localData, this.larguraPagina / 2, bottomBlockY, { align: 'center' });

    // Assinaturas
    const signaturesY = bottomBlockY + 15;
    doc.line(50, signaturesY, 120, signaturesY);
    doc.line(180, signaturesY, 250, signaturesY);
    doc.setFontSize(12);
    doc.text('Pastor Celebrante', 85, signaturesY + 5, { align: 'center' });
    doc.text('Bispo Diocesano', 215, signaturesY + 5, { align: 'center' });

    return doc.output('blob');
  }

  private renderStyledText(doc: jsPDF, parts: { text: string, bold: boolean, size: number }[], initialY: number, lineHeight: number, maxLineWidth: number): number {
    let currentY = initialY;
    
    const wordsWithStyle: { word: string, bold: boolean, size: number }[] = [];
    parts.forEach(part => {
        part.text.split(' ').forEach(word => {
            if (word.trim() !== '') {
                wordsWithStyle.push({ word: word, bold: part.bold, size: part.size });
            }
        });
    });

    const lines: { parts: { text: string, bold: boolean, size: number }[], width: number }[] = [];
    let currentLine: { text: string, bold: boolean, size: number }[] = [];
    let currentLineWidth = 0;

    wordsWithStyle.forEach(wordInfo => {
        const isFirstWordInLine = currentLine.length === 0;
        const wordText = isFirstWordInLine ? wordInfo.word : ' ' + wordInfo.word;
        
        doc.setFont('times', wordInfo.bold ? 'bold' : 'roman');
        doc.setFontSize(wordInfo.size);
        const wordWidth = doc.getTextWidth(wordText);

        if (currentLineWidth + wordWidth > maxLineWidth && !isFirstWordInLine) {
            lines.push({ parts: currentLine, width: currentLineWidth });
            currentLine = [];
            currentLineWidth = 0;
            
            doc.setFont('times', wordInfo.bold ? 'bold' : 'roman');
            doc.setFontSize(wordInfo.size);
            const newWordWidth = doc.getTextWidth(wordInfo.word);
            currentLine.push({ text: wordInfo.word, ...wordInfo });
            currentLineWidth = newWordWidth;
        } else {
            const lastPart = currentLine.length > 0 ? currentLine[currentLine.length - 1] : null;
            if (lastPart && lastPart.bold === wordInfo.bold && lastPart.size === wordInfo.size) {
                lastPart.text += wordText;
            } else {
                currentLine.push({ text: wordText, ...wordInfo });
            }
            currentLineWidth += wordWidth;
        }
    });

    if (currentLine.length > 0) {
        lines.push({ parts: currentLine, width: currentLineWidth });
    }

    lines.forEach(line => {
        let currentX = (this.larguraPagina - line.width) / 2;
        line.parts.forEach(part => {
            doc.setFont('times', part.bold ? 'bold' : 'roman');
            doc.setFontSize(part.size);
            doc.text(part.text, currentX, currentY);
            currentX += doc.getTextWidth(part.text);
        });
        currentY += lineHeight;
    });

    return currentY;
  }

  getNomeArquivo(nomeCompleto: string): string {
    return 'certificado-confirmacao-' + nomeCompleto.toLowerCase().replace(/\s+/g, '-') + '.pdf';
  }

  private formatarData(data: Date): string {
    return data.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}