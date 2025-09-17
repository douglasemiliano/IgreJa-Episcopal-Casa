import { TestBed } from '@angular/core/testing';

import { LecionarioService } from './lecionario.service';

describe('LecionarioService', () => {
  let service: LecionarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LecionarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
