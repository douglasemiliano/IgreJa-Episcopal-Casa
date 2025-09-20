import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { SupabaseService } from "../../../services/supabase.service";
import { LecionarioService } from "../../../services/lecionario.service";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIcon],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Input() isDarkMode = false;
  @Output() darkToggle = new EventEmitter<void>();

  @Output() sidenavToggle = new EventEmitter<void>();

  isExpanded: boolean = true;
  constructor(private router: Router, private supabase: SupabaseService, private lecionarioService: LecionarioService) { }

  onToggle() { this.darkToggle.emit(); }
  async logout() {
    await this.supabase.signOut(); // método que você já deve ter no seu service
    this.router.navigate(['/login']);
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
