import { Injectable } from '@angular/core';

import { AbstractGeoService } from './abstract-geo.service';
import { Place } from './place';
import { Point } from './point';

@Injectable()
export class GoogleGeoService extends AbstractGeoService {
  public constructor() {
    super();
  }

  public static toPlace(
    pr: google.maps.places.PlaceResult,
    photoOptions?: google.maps.places.PhotoOptions
  ): Place {
    if (!pr.geometry?.location || !pr.name) {
      throw new Error(`The PlaceResult is missing necessary values`);
    }
    const location: Point = pr.geometry
      ? {
          latitude: pr.geometry.location.lat(),
          longitude: pr.geometry.location.lng(),
        }
      : { latitude: 0, longitude: 0 };
    const place: Place = {
      formattedAddress: pr.formatted_address,
      formattedPhoneNumber: pr.formatted_phone_number,
      icon: pr.icon,
      location,
      name: pr.name,
      photos: [],
      placeId: pr.place_id,
      types: pr.types,
      url: pr.url,
      vicinity: pr.vicinity,
      website: pr.website,
    };

    if (photoOptions) {
      place.photos = (pr.photos || []).slice(0, 8).map((p) => ({
        height: p.height,
        html_attributions: p.html_attributions,
        url: p.getUrl(photoOptions),
        width: p.width,
      }));
    }

    return place;
  }

  private static getLatLng(coords: GeolocationCoordinates): google.maps.LatLng {
    return new google.maps.LatLng(coords.latitude, coords.longitude, true);
  }

  public computeDistanceBetween(
    from: GeolocationCoordinates,
    to: GeolocationCoordinates,
    radius?: number
  ): number {
    return google.maps.geometry.spherical.computeDistanceBetween(
      GoogleGeoService.getLatLng(from),
      GoogleGeoService.getLatLng(to),
      radius
    );
  }

  public async getCurrentPosition(
    options?: PositionOptions
  ): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve(p),
        (e) => reject(e),
        options
      );
    });
  }

  public async getPlaceDetails(placeId: string): Promise<Partial<Place>> {
    return new Promise<Place>((resolve, reject) => {
      const mapElement = document.getElementById('map');
      if (mapElement) {
        const placeService: google.maps.places.PlacesService =
          new google.maps.places.PlacesService(new google.maps.Map(mapElement));
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
            result: google.maps.places.PlaceResult | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              result
            ) {
              resolve(
                GoogleGeoService.toPlace(result, {
                  maxHeight: 500,
                  maxWidth: 320,
                })
              );
            } else {
              reject(status.toString());
            }
          }
        );
      } else {
        reject('no map element');
      }
    });
  }

  public async nearbyStoreSearch(
    coords: GeolocationCoordinates
  ): Promise<Place[]> {
    return new Promise<Place[]>((resolve, reject) => {
      const mapElement = document.getElementById('map');
      const supermarket = 'grocery_or_supermarket';
      if (mapElement) {
        const placeService: google.maps.places.PlacesService =
          new google.maps.places.PlacesService(new google.maps.Map(mapElement));
        const searchRequest: google.maps.places.PlaceSearchRequest = {
          bounds: undefined,
          keyword: undefined,
          location: GoogleGeoService.getLatLng(coords),
          name: undefined,
          openNow: undefined,
          radius: 2 * 1609.34,
          rankBy: undefined,
          type: supermarket,
        };
        try {
          placeService.nearbySearch(
            searchRequest,
            (
              results: google.maps.places.PlaceResult[] | null,
              status: google.maps.places.PlacesServiceStatus
            ) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results
              ) {
                console.log(results);
                resolve(results.map((gs) => GoogleGeoService.toPlace(gs)));
              } else {
                reject(status.toString());
              }
            }
          );
        } catch (e) {
          reject(JSON.stringify(e));
        }
      } else {
        reject('no map element');
      }
    });
  }
}
