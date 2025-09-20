import { Component, AfterViewInit, OnDestroy, ElementRef, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CoreService } from '../../../services/core.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnDestroy, OnInit {
  @Input() isExpanded = true;
  @Input() isDarkMode = false;
  @Output() darkToggle = new EventEmitter<void>();
  @Output() sidenavToggle = new EventEmitter<void>();

  private tooltips: Tooltip[] = [];

  private coreService: CoreService = inject(CoreService);
  private supabaseService: SupabaseService = inject(SupabaseService);

  fotoUsuario: string;
  avatarPadrao: string = "https://imgs.search.brave.com/CFBTYPNRel95sDw00APELv5D4Ghs73sYYcN0-tLpV5U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tYXJr/ZXRwbGFjZS5jYW52/YS5jb20vZ0pseTAv/TUFHRGtNZ0pseTAv/MS90bC9jYW52YS11/c2VyLXByb2ZpbGUt/aWNvbi12ZWN0b3Iu/LWF2YXRhci1vci1w/ZXJzb24taWNvbi4t/cHJvZmlsZS1waWN0/dXJlLC1wb3J0cmFp/dC1zeW1ib2wuLU1B/R0RrTWdKbHkwLnBu/Zw"
  isMobile: boolean

  constructor(private el: ElementRef) {
    this.coreService.isMobile$.subscribe({
      next: (data) => {
        this.isMobile = data;
        console.log('isMobile no sidebar:', data);
      }
    })

    this.coreService.isDarkMode$.subscribe({
      next: (data) => {
        this.isDarkMode = (data === 'dark');
        console.log('isDarkMode no sidebar:', data);
      } })
  }

  ngOnInit(): void {
      this.supabaseService.getSession().then(({ data: { session } }) => {
      if (session) {  
        console.log('session', session.user.user_metadata['avatar_url'])
        this.fotoUsuario = session.user.user_metadata['avatar_url']
      }
  })
  }

  ngAfterViewInit(): void {
    this.initializeTooltips();
  }

  ngOnDestroy(): void {
    this.disposeTooltips();
  }


  toggleSidebar(): void {
  this.isExpanded = !this.isExpanded;
  this.sidenavToggle.emit();
}

  private initializeTooltips(): void {
    this.disposeTooltips();
    if (!this.isExpanded) {
      const tooltipTriggerList = [].slice.call(this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'));
      this.tooltips = tooltipTriggerList.map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl));
    }
  }

  private disposeTooltips(): void {
    this.tooltips.forEach(tooltip => tooltip.dispose());
    this.tooltips = [];
  }

  onToggle() { 
    console.log('Emitting darkToggle from sidebar');
    this.darkToggle.emit(); 
  }

}