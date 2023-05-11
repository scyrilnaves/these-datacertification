import { TestBed } from '@angular/core/testing';

import { DatatransmitterService } from './datatransmitter.service';

describe('DatatransmitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatatransmitterService = TestBed.get(DatatransmitterService);
    expect(service).toBeTruthy();
  });
});
