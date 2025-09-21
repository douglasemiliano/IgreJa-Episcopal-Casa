import { TestBed } from '@angular/core/testing';

import { CertificadoBatismoService } from './certificado-batismo.service';

describe('CertificadoBatismoService', () => {
  let service: CertificadoBatismoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificadoBatismoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
