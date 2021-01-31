import { TestBed } from '@angular/core/testing';

import { ProvincesService } from './provinces.service';

describe('ProvincesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvincesService = TestBed.get(ProvincesService);
    expect(service).toBeTruthy();
  });
});
