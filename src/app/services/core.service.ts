import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private isMobileSubject = new BehaviorSubject<boolean>(this.checkScreen());
  isMobile$ = this.isMobileSubject.asObservable();

  constructor() {
    // já dispara o valor inicial
    this.updateScreen();
    // escuta resize do navegador
    window.addEventListener('resize', () => this.updateScreen());
  }

  private checkScreen(): boolean {
    return window.innerWidth <= 768;
  }

  private updateScreen() {
    this.isMobileSubject.next(this.checkScreen());
  }
}
