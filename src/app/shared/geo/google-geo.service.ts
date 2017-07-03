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

  public static toPlace(pr: google.maps.places.PlaceResult): Place {
    const place = new Place();
    place.formattedAddress = pr.formatted_address;
    place.formattedPhoneNumber = pr.formatted_phone_number;
    place.icon = pr.icon;
    place.location = {
      latitude: pr.geometry.location.lat(),
      longitude: pr.geometry.location.lng(),
    };
    place.name = pr.name;

    if (pr.photos && pr.photos.length > 0 && typeof pr.photos[0].getUrl === 'function') {
      place.photo = pr.photos[0].getUrl({ maxHeight: 300, maxWidth: 320 });
    }

    place.placeId = pr.place_id;
    place.types = pr.types;
    place.url = pr.url;
    place.website = pr.website;
    place.vicinity = pr.vicinity;

    return place;
  }

}
