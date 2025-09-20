import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu"; // 👈 importante
import { SupabaseService } from "../../../services/supabase.service";
import { LecionarioService } from "../../../services/lecionario.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule // 👈 importa aqui também
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() isDarkMode = false;
  @Output() darkToggle = new EventEmitter<void>();
  @Output() sidenavToggle = new EventEmitter<void>();

  isExpanded = true;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private lecionarioService: LecionarioService
  ) {}

  onToggle() {
    this.darkToggle.emit();
  }

  async logout() {
    await this.supabase.signOut();
    this.router.navigate(['/login']);
  }

  goToPerfil() {
    this.router.navigate(['/perfil']); // 👈 rota do perfil
  }

  goToCadastro() {
    this.lecionarioService.setLecionarioSelecionado(null);
    this.router.navigateByUrl('/cadastro');
  }

  onSidenavToggle() {
    this.isExpanded = !this.isExpanded;
    this.sidenavToggle.emit();
  }
}
