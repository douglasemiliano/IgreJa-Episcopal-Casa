import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoConfirmacaoComponent } from './certificado-confirmacao.component';

describe('CertificadoConfirmacaoComponent', () => {
  let component: CertificadoConfirmacaoComponent;
  let fixture: ComponentFixture<CertificadoConfirmacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadoConfirmacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificadoConfirmacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
