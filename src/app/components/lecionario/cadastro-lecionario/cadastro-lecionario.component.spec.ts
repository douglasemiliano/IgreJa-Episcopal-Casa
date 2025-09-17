import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroLecionarioComponent } from './cadastro-lecionario.component';

describe('CadastroLecionarioComponent', () => {
  let component: CadastroLecionarioComponent;
  let fixture: ComponentFixture<CadastroLecionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroLecionarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroLecionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
