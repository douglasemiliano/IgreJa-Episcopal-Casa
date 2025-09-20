import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarMembroComponent } from './cadastrar-membro.component';

describe('CadastrarMembroComponent', () => {
  let component: CadastrarMembroComponent;
  let fixture: ComponentFixture<CadastrarMembroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarMembroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastrarMembroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
