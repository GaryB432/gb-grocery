import { inject, TestBed } from '@angular/core/testing';

import { AbstractGeoService } from './abstract-geo.service';

describe('AbstractGeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AbstractGeoService],
    });
  });

  it('should be created', inject([AbstractGeoService], (service: AbstractGeoService) => {
    expect(service).toBeTruthy();
  }));
});
