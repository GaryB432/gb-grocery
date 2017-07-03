import { inject, TestBed } from '@angular/core/testing';

import { GoogleGeoService } from './google-geo.service';

describe('GoogleGeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleGeoService]
    });
  });

  it('should be created', inject([GoogleGeoService], (service: GoogleGeoService) => {
    expect(service).toBeTruthy();
  }));
});
