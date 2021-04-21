import { TestBed } from '@angular/core/testing';

import { SafePipeService } from './safe-pipe.service';

describe('SafePipeService', () => {
  let service: SafePipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafePipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
