import { Component, AfterViewInit, OnDestroy, ElementRef, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CoreService } from '../../../services/core.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatIcon, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  @Input() isExpanded = true;
  @Input() isDarkMode = false;
  @Output() darkToggle = new EventEmitter<void>();
  @Output() sidenavToggle = new EventEmitter<void>();

  private tooltips: Tooltip[] = [];

  private coreService: CoreService = inject(CoreService);
  isMobile: boolean

  constructor(private el: ElementRef) {
    this.coreService.isMobile$.subscribe({
      next: (data) => {
        this.isMobile = data;
        console.log('isMobile no sidebar:', data);
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