import { Injectable } from '@angular/core';

import { AbstractGeoService } from './abstract-geo.service';
import { Place } from './place';

@Injectable()
export class GoogleGeoService extends AbstractGeoService {
  constructor() {
    super();
  }

  public computeDistanceBetween(
    from: Coordinates,
    to: Coordinates,
    radius?: number
  ): number {
    return google.maps.geometry.spherical.computeDistanceBetween(
      GoogleGeoService.getLatLng(from),
      GoogleGeoService.getLatLng(to),
      radius
    );
  }

  public async nearbyStoreSearch(coords: Coordinates): Promise<Place[]> {
    return new Promise<Place[]>((resolve, reject) => {
      const grocery = 'grocery_or_supermarket';
      const placeService: google.maps.places.PlacesService = new google.maps.places.PlacesService(
        new google.maps.Map(document.getElementById('map'))
      );
      const searchRequest: google.maps.places.PlaceSearchRequest = {
        bounds: undefined,
        keyword: undefined,
        location: GoogleGeoService.getLatLng(coords),
        name: undefined,
        openNow: true,
        radius: 2 * 1609.34,
        rankBy: undefined,
        types: [grocery],
      };
      placeService.nearbySearch(
        searchRequest,
        (
          results: google.maps.places.PlaceResult[],
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results.map(gs => GoogleGeoService.toPlace(gs)));
          } else {
            reject(status.toString());
          }
        }
      );
    });
  }

  public async getPlaceDetails(placeId: string): Promise<Partial<Place>> {
    return new Promise<Place>((resolve, reject) => {
      const placeService: google.maps.places.PlacesService = new google.maps.places.PlacesService(
        new google.maps.Map(document.getElementById('map'))
      );
      const searchRequest: google.maps.places.PlaceDetailsRequest = {
        fields: [
          'name',
          'place_id',
          'formatted_phone_number',
          'geometry',
          'plus_code',
          'photo',
          'url',
        ],
        placeId,
      };
      placeService.getDetails(
        searchRequest,
        (
          result: google.maps.places.PlaceResult,
          status: google.maps.places.PlacesServiceStatus
        ) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(
              GoogleGeoService.toPlace(result, {
                maxWidth: 320,
                maxHeight: 500,
              })
            );
          } else {
            reject(status.toString());
          }
        }
      );
    });
  }

  public async getCurrentPosition(
    options?: PositionOptions
  ): Promise<Position> {
    return new Promise<Position>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        p => resolve(p),
        e => reject(e),
        options
      );
    });
  }

  public static toPlace(
    pr: google.maps.places.PlaceResult,
    photoOptions?: google.maps.places.PhotoOptions
  ): Place {
    const place: Place = {
      formattedAddress: pr.formatted_address,
      formattedPhoneNumber: pr.formatted_phone_number,
      icon: pr.icon,
      location: {
        latitude: pr.geometry.location.lat(),
        longitude: pr.geometry.location.lng(),
      },
      name: pr.name,
      photos: [],
      placeId: pr.place_id,
      types: pr.types,
      url: pr.url,
      vicinity: pr.vicinity,
      website: pr.website,
    };

    if (photoOptions) {
      place.photos = pr.photos.slice(0, 8).map(p => ({
        height: p.height,
        html_attributions: p.html_attributions,
        width: p.width,
        url: p.getUrl(photoOptions),
      }));
    }

    return place;
  }

  private static getLatLng(coords: Coordinates): google.maps.LatLng {
    return new google.maps.LatLng(coords.latitude, coords.longitude, true);
  }
}
