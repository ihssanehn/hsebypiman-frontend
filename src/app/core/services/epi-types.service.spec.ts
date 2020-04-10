import { TestBed } from '@angular/core/testing';

import { EpiTypesService } from './epi-types.service';

describe('EpiTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpiTypesService = TestBed.get(EpiTypesService);
    expect(service).toBeTruthy();
  });
});
