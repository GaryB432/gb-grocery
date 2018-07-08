import { inject, TestBed } from '@angular/core/testing';

import { DataLocalStorageService } from './data-local-storage.service';

describe('DataLocalstorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataLocalStorageService],
    });
  });

  it('should be created', inject(
    [DataLocalStorageService],
    (service: DataLocalStorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
