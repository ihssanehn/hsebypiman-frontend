import { TestBed } from '@angular/core/testing';

import { CatRisqueService } from './cat-risque.service';

describe('CatRisqueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CatRisqueService = TestBed.get(CatRisqueService);
    expect(service).toBeTruthy();
  });
});
