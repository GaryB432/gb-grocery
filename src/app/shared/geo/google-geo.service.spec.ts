import { inject, TestBed } from '@angular/core/testing';

import { GoogleGeoService } from './google-geo.service';
import { Place } from './place';

namespace FakeGoogle {

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
  }

  export class LatLng {
    constructor(private readonly xlat: number, private readonly xlng: number, noWrap?: boolean) { }
    equals(other: LatLng): boolean { return false; }
    lat(): number { return this.xlat; }
    lng(): number { return this.xlng; }
    toString(): string { return ''; }
    toUrlValue(precision?: number): string { return ''; }
    toJSON(): LatLngLiteral { return { lat: 0, lng: 0 }; }
  }

  export class LatLngBounds {
    private templl = new LatLng(0, 0);
    constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral) { }
    contains(latLng: LatLng | LatLngLiteral): boolean { return false; }
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean { return false; }
    extend(point: LatLng | LatLngLiteral): LatLngBounds { return new LatLngBounds(); }
    getCenter(): LatLng { return this.templl; }
    getNorthEast(): LatLng { return this.templl; }
    getSouthWest(): LatLng { return this.templl; }
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean { return false; }
    isEmpty(): boolean { return false; }
    toJSON(): LatLngBoundsLiteral { return { east: 0, north: 0, south: 0, west: 0 }; }
    toSpan(): LatLng { return this.templl; }
    toString(): string { return ''; }
    toUrlValue(precision?: number): string { return ''; }
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds { return new LatLngBounds(); }
  }
}

describe('GoogleGeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleGeoService]
    });
  });

  it('should be created', inject([GoogleGeoService], (service: GoogleGeoService) => {
    expect(service).toBeTruthy();
  }));

  it('should translate', () => {

    const fakePlace = {
      address_components: [] as google.maps.GeocoderAddressComponent[],
      aspects: [] as google.maps.places.PlaceAspectRating[],
      formatted_address: 'formatted_address',
      formatted_phone_number: 'formatted_phone_number',
      geometry: {
        location: new FakeGoogle.LatLng(2, 3),
        viewport: new FakeGoogle.LatLngBounds()
      },
      html_attributions: [''],
      icon: 'icon',
      international_phone_number: 'international_phone_number',
      name: 'name',
      opening_hours: {
        open_now: true,
        periods: [] as google.maps.places.OpeningPeriod[],
        weekday_text: [] as string[]
      },
      permanently_closed: false,
      photos: [
        {
          height: 0,
          html_attributions: [] as string[],
          width: 0,
          getUrl: (opts: any) => 'photo'
        }
      ],
      place_id: 'place_id',
      price_level: 99,
      rating: 4,
      reviews: [] as google.maps.places.PlaceReview[],
      types: ['a', 'b'],
      url: 'url',
      vicinity: 'vicinity',
      website: 'website',
    };

    const expected = Object.assign(new Place(), {
      formattedAddress: 'formatted_address',
      formattedPhoneNumber: 'formatted_phone_number',
      icon: 'icon',
      location: { latitude: 2, longitude: 3 },
      name: 'name',
      photo: 'photo',
      placeId: 'place_id',
      types: ['a', 'b'],
      url: 'url',
      website: 'website',
      vicinity: 'vicinity'
    });

    expect(GoogleGeoService.toPlace(fakePlace)).toEqual(expected);
  });

});
