import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

export interface DadosBatismo {
  id?: string;
  numero_registro?: number;   // número do registro no livro
  nome_irmao?: string;        // nome da pessoa batizada
  data_nascimento?: string;  
  nacionalidade?: string;  
  pai?: string;  
  mae?: string;  
  padrinho?: string;  
  madrinha?: string;  
  data_batismo?: string;  
  pastor?: string;  
  secretario?: string;  
  livro?: string;  
  pagina?: string;  
  rua?: string;  
  numero_endereco?: string;   // número da residência
  complemento?: string;  
  bairro?: string;  
  cidade?: string;  
  estado?: string;  
  cep?: string;  
  pais?: string;  
}


@Injectable({
  providedIn: 'root'
})
export class LivroBatismoService {

  private readonly larguraPagina = 210; // A4 vertical
  private readonly alturaPagina = 297;
  private readonly margin = 20;
  private readonly lineHeight = 7;
  private readonly logoWidth = 30;
  private readonly logoHeight = 30;


    private formatarData(data: string | undefined): string {
      const dataObj = new Date(data || '');
      return dataObj.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
  }

  private renderStyledText(doc: jsPDF, parts: { text: string, bold: boolean }[], initialY: number, lineHeight: number, maxLineWidth: number): number {
    let currentY = initialY;

    const wordsWithStyle: { word: string, bold: boolean }[] = [];
    parts.forEach(part => {
        part.text.split(' ').forEach(word => {
            if (word.trim() !== '') {
                wordsWithStyle.push({ word: word, bold: part.bold });
            }
        });
    });

    const lines: { parts: { text: string, bold: boolean }[], width: number }[] = [];
    let currentLine: { text: string, bold: boolean }[] = [];
    let currentLineWidth = 0;

    wordsWithStyle.forEach(wordInfo => {
        const isFirstWordInLine = currentLine.length === 0;
        const wordText = isFirstWordInLine ? wordInfo.word : ' ' + wordInfo.word;

        doc.setFont('times', wordInfo.bold ? 'bold' : 'normal');
        doc.setFontSize(12);
        const wordWidth = doc.getTextWidth(wordText);

        if (currentLineWidth + wordWidth > maxLineWidth && !isFirstWordInLine) {
            lines.push({ parts: currentLine, width: currentLineWidth });
            currentLine = [];
            currentLineWidth = 0;

            doc.setFont('times', wordInfo.bold ? 'bold' : 'normal');
            doc.setFontSize(12);
            const newWordWidth = doc.getTextWidth(wordInfo.word);
            currentLine.push({ text: wordInfo.word, bold: wordInfo.bold });
            currentLineWidth = newWordWidth;
        } else {
            const lastPart = currentLine.length > 0 ? currentLine[currentLine.length - 1] : null;
            if (lastPart && lastPart.bold === wordInfo.bold) {
                lastPart.text += wordText;
            } else {
                currentLine.push({ text: wordText, bold: wordInfo.bold });
            }
            currentLineWidth += wordWidth;
        }
    });

    if (currentLine.length > 0) {
        lines.push({ parts: currentLine, width: currentLineWidth });
    }

    lines.forEach(line => {
        let currentX = this.margin; // Alinhado à esquerda
        line.parts.forEach(part => {
            doc.setFont('times', part.bold ? 'bold' : 'normal');
            doc.setFontSize(12);
            doc.text(part.text, currentX, currentY + 20);
            currentX += doc.getTextWidth(part.text);
        });
        currentY += lineHeight;
    });

    return currentY;
  }

  private gerarPaginaBatismo(doc: jsPDF, dados: DadosBatismo) {
    doc.setFont('times', 'Roman');

    // Logos
    try {
      doc.addImage("casa.png", 'PNG', this.margin, this.margin, this.logoWidth, this.logoHeight);
      doc.addImage("diocese.png", 'PNG', this.larguraPagina - this.margin - this.logoWidth, this.margin, this.logoWidth, this.logoHeight);
      doc.addImage("timbrado.jpg", 'JPEG', 0, 0, this.larguraPagina, this.alturaPagina);
    } catch (e) {
      console.error("Erro ao adicionar logos. Verifique se os arquivos 'casa.png' e 'diocese.png' estão na pasta de assets.", e);
    }

    let currentY = this.margin;

    // Título
    doc.setFontSize(20);
    doc.setFont('times', 'bold');
    doc.text('REGISTRO DE BATISMO', this.larguraPagina / 2, currentY + 55, { align: 'center' });
    currentY += this.logoHeight + 10;

    // Batismo nº
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    doc.text(`Batismo nº ${dados.numero_registro || '_________'}`, this.larguraPagina - this.margin, currentY - 40, { align: 'right' });
    currentY += this.lineHeight * 2;

    // Texto principal
    doc.setFontSize(12);
    doc.setFont('times', 'normal');

    const padrinhosTexto = [dados.padrinho, dados.madrinha].filter(p => p && p.trim()).join(' e ');
    const temPadrinhos = padrinhosTexto.length > 0;

    const textParts = [
      { text: `Fica registrado neste livro, que `, bold: false },
      { text: `${dados.nome_irmao || '_____________________________________________________________________'},`, bold: true },
      { text: ` nascido(a) em ${this.formatarData(dados.data_nascimento!)}, filho(a) de ${dados.pai || '_____________________________________________________________________________________________________________'} e ${dados.mae || '_____________________________________________________________________________________________'}, residente à ${dados.rua || '___________________________________________________________________________________________________________'} nº ${dados.numero_endereco || '__________,'}, ${dados.complemento ? ' complemento ' + dados.complemento : ''} ${dados.bairro || '________________,'}, ${dados.cidade || '________________,'} - ${dados.estado || '______________,'}, CEP: ${dados.cep || '_________________________,'}, foi batizado em nome do Pai, do Filho e do Espírito Santo, conforme a exemplo de Nosso Senhor e Salvador Jesus Cristo (Mateus 28:19), no dia ${this.formatarData(dados.data_batismo!)} na Igreja Episcopal Casa,`, bold: false },
      { text: temPadrinhos ? `e tendo como padrinhos ${padrinhosTexto}.` : '', bold: false },
    ];

    currentY = this.renderStyledText(doc, textParts, currentY, this.lineHeight, this.larguraPagina - this.margin * 2);
    currentY += this.lineHeight * 6; // Aumenta o espaço para descer as assinaturas

    // Assinaturas
    const signatureLineLength = 65;
    const line1X1 = this.margin + 10;
    const line1X2 = line1X1 + signatureLineLength;
    const line2X1 = this.larguraPagina - this.margin - 10 - signatureLineLength;
    const line2X2 = line2X1 + signatureLineLength;
    const centerPos = this.larguraPagina / 2;

    // Pai e Mãe
    doc.line(line1X1, currentY, line1X2, currentY);
    doc.line(line2X1, currentY, line2X2, currentY);
    currentY += this.lineHeight;
    doc.text('Pai', (line1X1 + line1X2) / 2, currentY, { align: 'center' });
    doc.text('Mãe', (line2X1 + line2X2) / 2, currentY, { align: 'center' });
    currentY += this.lineHeight * 2.5;

    // Padrinho e Madrinha
    doc.line(line1X1, currentY + 10, line1X2, currentY+10);
    doc.line(line2X1, currentY+ 10, line2X2, currentY + 10);
    currentY += this.lineHeight + 10;
    doc.text('Padrinho', (line1X1 + line1X2) / 2, currentY, { align: 'center' });
    doc.text('Madrinha', (line2X1 + line2X2) / 2, currentY, { align: 'center' });
    currentY += this.lineHeight * 2.5;

    // Data, Local e Assinatura do Pastor
    const localData = `Jaboatão dos Guararapes, ${this.formatarData(dados.data_batismo)}`;
    doc.text(localData, centerPos, currentY + 10, { align: 'center' });
    currentY += this.lineHeight * 4;

    const pastorSignatureLineLength = 70;
    doc.line(centerPos - pastorSignatureLineLength / 2, currentY, centerPos + pastorSignatureLineLength / 2, currentY);
    currentY += this.lineHeight;
    doc.text('Pastor Celebrante', centerPos, currentY, { align: 'center' });

    // Número da página
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    const pageNumberText = `${dados.pagina || '___'}`;
    doc.text(pageNumberText, this.larguraPagina / 2, this.alturaPagina - 15, { align: 'center' });
  }

  async gerarDocumento(dados: DadosBatismo): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    this.gerarPaginaBatismo(doc, dados);

    return doc.output('blob');
  }

  async gerarLivroCompleto(dadosArray: DadosBatismo[]): Promise<Blob> {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    dadosArray.forEach((dados, index) => {
      if (index > 0) {
        doc.addPage();
      }
      this.gerarPaginaBatismo(doc, dados);
    });

    return doc.output('blob');
  }

  getNomeArquivo(nomeIrmao: string): string {
    return 'livro-batismo-' + (nomeIrmao || 'desconhecido').toLowerCase().replace(/\s+/g, '-') + '.pdf';
  }
}
