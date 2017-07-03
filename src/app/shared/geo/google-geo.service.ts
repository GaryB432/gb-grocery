import { Injectable } from '@angular/core';

import { AbstractGeoService } from './abstract-geo.service';
import { Place } from './place';

@Injectable()
export class GoogleGeoService implements AbstractGeoService {
  constructor() { }

  public computeDistanceBetween(from: Coordinates, to: Coordinates, radius?: number): number {
    throw new Error('Method not implemented.');
  }
  public async getAddress(coords: Coordinates): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public async nearbyStoreSearch(coords: Coordinates): Promise<Place[]> {
    throw new Error('Method not implemented.');
  }
  public async getCurrentPosition(options?: PositionOptions): Promise<Position> {
    throw new Error('Method not implemented.');
  }

}
