// tslint:disable:max-classes-per-file
import { inject, TestBed } from '@angular/core/testing';

import { GoogleGeoService } from './google-geo.service';
import { Place } from './place';

/* tslint:disable-next-line:no-namespace */
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
    private lit: LatLngLiteral;
    constructor(lat: number, lng: number, noWrap?: boolean) {
      this.lit = { lat, lng };
    }
    public equals(other: LatLng): boolean {
      return false;
    }
    public lat(): number {
      return this.lit.lat;
    }
    public lng(): number {
      return this.lit.lng;
    }
    public toUrlValue(precision?: number): string {
      return '';
    }
    public toJSON(): LatLngLiteral {
      return this.lit;
    }
  }

  export class LatLngBounds {
    private templl = new LatLng(0, 0);
    constructor(
      public sw?: LatLng | LatLngLiteral,
      public ne?: LatLng | LatLngLiteral
    ) {}
    public contains(latLng: LatLng | LatLngLiteral): boolean {
      return false;
    }
    public equals(other: LatLngBounds | LatLngBoundsLiteral): boolean {
      return false;
    }
    public extend(point: LatLng | LatLngLiteral): LatLngBounds {
      return new LatLngBounds();
    }
    public getCenter(): LatLng {
      return this.templl;
    }
    public getNorthEast(): LatLng {
      return this.templl;
    }
    public getSouthWest(): LatLng {
      return this.templl;
    }
    public intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean {
      return false;
    }
    public isEmpty(): boolean {
      return false;
    }
    public toJSON(): LatLngBoundsLiteral {
      return { east: 0, north: 0, south: 0, west: 0 };
    }
    public toSpan(): LatLng {
      return this.templl;
    }
    public toUrlValue(precision?: number): string {
      return '';
    }
    public union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds {
      return new LatLngBounds();
    }
  }
}

describe('GoogleGeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleGeoService],
    });
  });

  it('should be created', inject(
    [GoogleGeoService],
    (service: GoogleGeoService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('should translate', () => {
    const fakePlace: google.maps.places.PlaceResult = {
      address_components: [] as google.maps.GeocoderAddressComponent[],
      adr_address: 'adr_address',
      formatted_address: 'formatted_address',
      formatted_phone_number: 'formatted_phone_number',
      geometry: {
        location: new FakeGoogle.LatLng(2, 3),
        viewport: new FakeGoogle.LatLngBounds(),
      },
      html_attributions: [''],
      icon: 'icon',
      id: 'id',
      international_phone_number: 'international_phone_number',
      name: 'name',
      opening_hours: {
        open_now: true,
        periods: [] as google.maps.places.OpeningPeriod[],
        weekday_text: [] as string[],
      },
      permanently_closed: false,
      photos: [
        {
          getUrl: (opts: any) => 'photo',
          height: 0,
          html_attributions: [] as string[],
          width: 0,
        },
      ],
      place_id: 'place_id',
      price_level: 99,
      rating: 4,
      reviews: [] as google.maps.places.PlaceReview[],
      types: ['a', 'b'],
      url: 'url',
      utc_offset: 5,
      vicinity: 'vicinity',
      website: 'website',
    };

    const expected: Place = {
      formattedAddress: 'formatted_address',
      formattedPhoneNumber: 'formatted_phone_number',
      icon: 'icon',
      location: { latitude: 2, longitude: 3 },
      name: 'name',
      photos: [],
      placeId: 'place_id',
      types: ['a', 'b'],
      url: 'url',
      vicinity: 'vicinity',
      website: 'website',
    };

    expect(GoogleGeoService.toPlace(fakePlace)).toEqual(expected);
  });
});
