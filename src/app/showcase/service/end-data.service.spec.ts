import { TestBed } from '@angular/core/testing';

import { EndDataService } from './end-data.service';

describe('EndDataService', () => {
  let service: EndDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
