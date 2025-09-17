import { TestBed } from '@angular/core/testing';

import { CertificadoConfirmacaoService } from './certificado-confirmacao.service';

describe('CertificadoConfirmacaoService', () => {
  let service: CertificadoConfirmacaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificadoConfirmacaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
