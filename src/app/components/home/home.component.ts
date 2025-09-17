import { CdkDrag } from "@angular/cdk/drag-drop";
import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatRippleModule, provideNativeDateAdapter } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router } from "@angular/router";
import { LecionarioService } from "../../services/lecionario.service";

@Component({
  selector: 'app-home',
  imports: [FormsModule,
    CommonModule, MatButtonModule,
    MatIconModule, MatRippleModule, MatCardModule, ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule,
    MatInputModule, OverlayModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'lecionario';
  dataUnica: Date = new Date();

  constructor(private router: Router, private service: LecionarioService){}

  mudouData() {
    this.service.dataUnica.set(this.dataUnica);    
    this.router.navigateByUrl("/lecionario")
  }

  goToCadastro() {
    this.router.navigateByUrl("/cadastro")
  }

  goToLecionario() {
    this.service.dataUnica.set(this.dataUnica);    
    this.router.navigateByUrl("/lecionario")  
  }
}
