import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoBatismoComponent } from './certificado-batismo.component';

describe('CertificadoBatismoComponent', () => {
  let component: CertificadoBatismoComponent;
  let fixture: ComponentFixture<CertificadoBatismoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificadoBatismoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificadoBatismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
