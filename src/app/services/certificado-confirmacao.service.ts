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

  async gerarCertificado(dados: DadosCertificado): Promise<Blob> {
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
      'Em nome do Pai, e do Filho, e do Espírito Santo.',
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

    // Texto principal - renderizado em blocos para permitir o nome em negrito
    doc.setFontSize(16);
    let currentY = this.margin + this.logoHeight + 70;
    let confirmacaoConcatenada = false;

    // Dados pessoais
    const nomeBispo = dados.bispo;
    if (dados.dataNascimento && dados.nomePais && dados.naturalidade) {
      // Linha introdutória
      doc.setFont('times', 'roman');
      doc.setFontSize(16);
      doc.text('Certificamos que', this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += 8;

      // Nome em negrito, linha separada
      doc.setFont('times', 'bold');
      doc.setFontSize(20);
      doc.text(dados.nomeCompleto, this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += 12;

      // Detalhes pessoais
      doc.setFont('times', 'roman');
      doc.setFontSize(16);
      const detalhes = 'natural de ' + dados.naturalidade + ', nascido(a) em ' + this.formatarData(dados.dataNascimento) + ', filho(a) de ' + dados.nomePais + ',';
      const linhasDetalhes = doc.splitTextToSize(detalhes, 250);
      doc.text(linhasDetalhes, this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += linhasDetalhes.length * 7;
    } else {
      // Preparar todos os textos
      const intro = 'Certificamos que ';
      const nome = dados.nomeCompleto || '';
      const continuacao = 'recebeu o rito apostólico da Confirmação no dia ' + this.formatarData(dados.dataConfirmacao) +
                         ', na Igreja ' + dados.igreja + ', Diocese ' + dados.diocese +
                         ', pela imposição das mãos do Reverendo Bispo ' + nomeBispo + '.';
      
      // Medir larguras com suas respectivas fontes
      doc.setFont('times', 'roman');
      doc.setFontSize(16);
      const widthIntro = doc.getTextWidth(intro);
      doc.setFont('times', 'bold');
      doc.setFontSize(20);
      const widthNome = doc.getTextWidth(nome);
      
      // Tentar incluir parte do texto de continuação na primeira linha
      doc.setFont('times', 'roman');
      doc.setFontSize(16);
      
      // Dividir o texto de continuação em palavras
      const palavrasContinuacao = continuacao.split(' ');
      let textoPrimeiraLinha = '';
      let textoRestante = '';
      let widthDisponivel = this.larguraPagina - (2 * this.margin); // Largura total disponível
      let widthUsada = widthIntro + widthNome; // Espaço já usado pelo intro e nome
      
      // Tentar adicionar palavras até preencher a largura disponível
      for (let i = 0; i < palavrasContinuacao.length; i++) {
        const palavraAtual = (i === 0 ? ' ' : ' ') + palavrasContinuacao[i];
        const widthPalavra = doc.getTextWidth(palavraAtual);
        
        if (widthUsada + widthPalavra <= widthDisponivel) {
          textoPrimeiraLinha += palavraAtual;
          widthUsada += widthPalavra;
        } else {
          textoRestante = palavrasContinuacao.slice(i).join(' ');
          break;
        }
      }
      
      // Se não couberam palavras adicionais, textoRestante recebe todo o texto
      if (textoRestante === '' && textoPrimeiraLinha === '') {
        textoRestante = continuacao;
      }
      
      // Centralizar e desenhar primeira linha
      const startX = (this.larguraPagina / 2) - (widthUsada / 2);
      
      doc.setFont('times', 'roman');
      doc.setFontSize(16);
      doc.text(intro, startX, currentY);
      
      doc.setFont('times', 'bold');
      doc.setFontSize(20);
      doc.text(nome, startX + widthIntro, currentY);
      
      if (textoPrimeiraLinha) {
        doc.setFont('times', 'roman');
        doc.setFontSize(16);
        doc.text(textoPrimeiraLinha, startX + widthIntro + widthNome, currentY);
      }
      
      currentY += 8;
      
      // Quebrar e centralizar o texto restante se houver
      if (textoRestante) {
        const linhasRestantes = doc.splitTextToSize(textoRestante, 250);
        doc.setFont('times', 'roman');
        doc.setFontSize(16);
        doc.text(linhasRestantes, this.larguraPagina / 2, currentY, { align: 'center' });
        currentY += linhasRestantes.length * 7;
      }
      
      confirmacaoConcatenada = true;
    }

    // Dados do batismo
    if (dados.dataBatismo && dados.igrejaBatismo) {
      const batismoText = 'batizado(a) em ' + this.formatarData(dados.dataBatismo) + ' na Igreja ' + dados.igrejaBatismo + ',';
      const linhasBat = doc.splitTextToSize(batismoText, 250);
      doc.text(linhasBat, this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += linhasBat.length * 7;
    }

    // Dados da confirmação
    if (!confirmacaoConcatenada) {
      const confirmacaoText = 'recebeu o rito apostólico da Confirmação no dia ' + this.formatarData(dados.dataConfirmacao) + ', na Igreja ' + dados.igreja + ', Diocese ' + dados.diocese + ', pela imposição das mãos do Reverendo Bispo ' + nomeBispo + '.';
      const linhasConfirm = doc.splitTextToSize(confirmacaoText, 250);
      doc.text(linhasConfirm, this.larguraPagina / 2, currentY, { align: 'center' });
      currentY += linhasConfirm.length * 7;
    }

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
    doc.text(localData, this.larguraPagina / 2, this.alturaPagina - 55, { align: 'center' });

    // Assinaturas
    doc.line(50, this.alturaPagina - 35, 120, this.alturaPagina - 35);
    doc.line(180, this.alturaPagina - 35, 250, this.alturaPagina - 35);
    doc.setFontSize(12);
    doc.text('Pároco', 85, this.alturaPagina - 30, { align: 'center' });
    doc.text('Bispo Diocesano', 215, this.alturaPagina - 30, { align: 'center' });

    return doc.output('blob');
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