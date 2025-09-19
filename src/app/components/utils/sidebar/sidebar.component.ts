import { Component, AfterViewInit, OnDestroy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tooltip } from 'bootstrap';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

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
  
  private tooltips: Tooltip[] = [];

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initializeTooltips();
  }

  ngOnDestroy(): void {
    this.disposeTooltips();
  }

  // toggleSidebar(): void {
  //   this.isExpanded = !this.isExpanded;
  //   setTimeout(() => this.initializeTooltips());
  // }


  toggleSidebar(): void {
  this.isExpanded = !this.isExpanded;
  const sidebarEl = this.el.nativeElement.querySelector('app-sidebar');

  if (this.isExpanded) {
    sidebarEl.classList.add('expanded');
    sidebarEl.classList.remove('collapsed');
  } else {
    sidebarEl.classList.add('collapsed');
    sidebarEl.classList.remove('expanded');
  }
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