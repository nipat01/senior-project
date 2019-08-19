import { TestBed } from '@angular/core/testing';

import { LineNotifyService } from './line-notify.service';

describe('LineNotifyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineNotifyService = TestBed.get(LineNotifyService);
    expect(service).toBeTruthy();
  });
});
