import { TestBed } from '@angular/core/testing';

import { CordysServiceService } from './cordys-service.service';

describe('CordysServiceService', () => {
  let service: CordysServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CordysServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
