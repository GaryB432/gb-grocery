import { inject, TestBed } from '@angular/core/testing';

import { DataLocalstorageService } from './data-localstorage.service';

describe('DataLocalstorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataLocalstorageService]
    });
  });

  it('should be created', inject([DataLocalstorageService], (service: DataLocalstorageService) => {
    expect(service).toBeTruthy();
  }));
});
