import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivroRegistroComponent } from './livro-registro.component';

describe('LivroRegistroComponent', () => {
  let component: LivroRegistroComponent;
  let fixture: ComponentFixture<LivroRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivroRegistroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivroRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
