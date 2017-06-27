import { inject, TestBed } from '@angular/core/testing';

import { GoogleGeoCoder } from './geocoding.service';

describe('GeocodingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleGeoCoder]
    });
  });

  it('should be created', inject([GoogleGeoCoder], (service: GoogleGeoCoder) => {
    expect(service).toBeTruthy();
  }));
});
