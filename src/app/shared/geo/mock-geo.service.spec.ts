import { inject, TestBed } from '@angular/core/testing';

import { MockGeoService } from './mock-geo.service';

describe('MockGeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MockGeoService],
    });
  });

  it('should be created', inject([MockGeoService], (service: MockGeoService) => {
    expect(service).toBeTruthy();
  }));
});
