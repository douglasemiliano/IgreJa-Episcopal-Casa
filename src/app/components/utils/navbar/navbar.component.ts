import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { SupabaseService } from "../../../services/supabase.service";
import { LecionarioService } from "../../../services/lecionario.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router, private supabase: SupabaseService, private lecionarioService: LecionarioService) {}

  async logout() {
    await this.supabase.signOut(); // método que você já deve ter no seu service
    this.router.navigate(['/login']);
  }

  goToCadastro(){
    this.lecionarioService.setLecionarioSelecionado(null);
    this.router.navigateByUrl('/cadastro');
  }
}
