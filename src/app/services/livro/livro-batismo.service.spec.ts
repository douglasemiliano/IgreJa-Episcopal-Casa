import { TestBed } from '@angular/core/testing';

import { LivroBatismoService } from './livro-batismo.service';

describe('LivroBatismoService', () => {
  let service: LivroBatismoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivroBatismoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
