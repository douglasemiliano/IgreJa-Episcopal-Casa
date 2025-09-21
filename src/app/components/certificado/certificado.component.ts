import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './certificado.component.html',
  styleUrl: './certificado.component.scss'
})
export class CertificadoComponent {

}
