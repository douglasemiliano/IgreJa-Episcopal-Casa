import { TestBed } from '@angular/core/testing';

import { RegistroBatismoService } from './registro-batismo.service';

describe('RegistroBatismoService', () => {
  let service: RegistroBatismoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroBatismoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
