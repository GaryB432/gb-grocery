import { Injectable } from '@angular/core';
import * as Dto from '../../shared/data/dto';
import { Utilities } from '../utilities';
import { AbstractGeoService } from './abstract-geo.service';
import { Place } from './place';
import { Point } from './point';

@Injectable()
export class MockGeoService extends AbstractGeoService {
  public constructor() {
    super();
  }

  public computeDistanceBetween(
    from: GeolocationCoordinates,
    to: GeolocationCoordinates
  ): number {
    const x1: number = from.longitude;
    const x2: number = to.longitude;
    const y1: number = from.latitude;
    const y2: number = to.latitude;
    const dx: number = (x1 - x2) ** 2;
    const dy: number = (y1 - y2) ** 2;
    return Math.sqrt(dx + dy);
  }

  public async getCurrentPosition(
    _options?: PositionOptions
  ): Promise<GeolocationPosition> {
    const hhCoords: GeolocationCoordinates = {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 38.575547947584255,
      longitude: -90.55149092347412,
      speed: 0,
    };
    return Promise.resolve({ coords: hhCoords, timestamp: 0 });
  }

  public async getPlaceDetails(placeId: string): Promise<Partial<Place>> {
    throw new Error('Method not implemented.');
  }

  public async nearbyStoreSearch(
    coords: GeolocationCoordinates
  ): Promise<Place[]> {
    function makePlace(ks: Dto.Store, n: number): Place {
      const spot: Point = {
        latitude: coords.latitude + n * 2,
        longitude: coords.longitude + n * 2,
      };
      return {
        formattedAddress: `formatted_address ${n}`,
        formattedPhoneNumber: `formatted_phone_number ${n}`,
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
        location: { ...spot },
        name: `${ks.name} S${n}`,
        photos: [],
        placeId: ks.place_id,
        types: ['grocery_or_supermarket', 'fake', 'store'],
        url: `url ${n}`,
        vicinity: ks.vicinity,
        website: `website ${n}`,
      };
    }

    const knownStores: Dto.Store[] = [
      {
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
        id: 'S-KOBIM',
        name: 'Schnucks',
        place_id: 'ChIJ43DkSEvU2IcRgU4nzYWcNU0',
        vicinity: '15425 Manchester Road, Ballwin',
      },
      {
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
        id: 'S-f2jIj',
        name: 'Big Lots',
        place_id: 'ChIJQ9yAC2zU2IcR4fcxoawalqI',
        vicinity: '14850 Manchester Road, Ballwin',
      },
      {
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
        id: 'S-F5TXz',
        name: 'Schnucks',
        place_id: 'ChIJ0-z4P9jT2IcRbt566e0iJIY',
        vicinity: '1393 Big Bend Road #1, Ballwin',
      },
    ];

    const otherPlaces: Place[] = [3, 4, 5].map((ndx) =>
      makePlace(
        {
          icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
          id: `s${ndx}`,
          name: `STORE ${ndx}`,
          place_id: `GP${ndx}`,
          vicinity: `Vicinity ${ndx}`,
        },
        ndx
      )
    );

    const fakePlaces: Place[] = knownStores.map(makePlace);

    return new Promise<Place[]>((resolve) => {
      window.setTimeout(() => {
        resolve(Utilities.flatten([fakePlaces, otherPlaces]));
      }, 200);
    });
  }
}
