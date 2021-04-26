import { TestBed } from '@angular/core/testing';

import { SafePipe } from './safe-pipe.pipe';

describe('SafePipe', () => {
  let service: SafePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SafePipe]
    });
    service = TestBed.inject(SafePipe);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
