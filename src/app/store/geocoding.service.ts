import { Injectable } from "@angular/core";
import { IDtoStore } from "../shared/interfaces";

const flatten: (a: any[][]) => any[] = require("arr-flatten");

@Injectable()
export abstract class AbstractGeoCoder {

  public abstract computeDistanceBetween(from: Coordinates, to: Coordinates, radius?: number): number;

  public abstract getAddress(coords: Coordinates, done: (s: string) => void, fail: (s: google.maps.GeocoderStatus) => void): void;

  public abstract nearbyStoreSearch(coords: Coordinates): Promise<google.maps.places.PlaceResult[]>;

  public abstract getCurrentPosition(
    successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): void;
}

@Injectable()
export class GoogleGeoCoder extends AbstractGeoCoder {
  public computeDistanceBetween(from: Coordinates, to: Coordinates, radius?: number): number {
    return google.maps.geometry.spherical.computeDistanceBetween(
      this.getLatLng(from),
      this.getLatLng(to),
      radius);
  }
  public getAddress(coords: Coordinates, done: (s: string) => void, fail: (s: google.maps.GeocoderStatus) => void): void {
    // fail(google.maps.GeocoderStatus.INVALID_REQUEST);
    // setTimeout(() => done(GoogleGeocoding.GeoCoder.getLatLng(coords).toString()), 3000);
    new google.maps.Geocoder()
      .geocode(
      { location: this.getLatLng(coords) },
      (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
        if (status === google.maps.GeocoderStatus.OK) {
          done(results[0].formatted_address);
        } else {
          fail(status);
        }
      });
  }
  public nearbyStoreSearch(coords: Coordinates): Promise<google.maps.places.PlaceResult[]> {
    return new Promise<google.maps.places.PlaceResult[]>(
      (resolve, reject) => {
        const grocery: string = "grocery_or_supermarket";
        const placeService: google.maps.places.PlacesService
          = new google.maps.places.PlacesService(new google.maps.Map(document.getElementById("map")));
        const searchRequest: google.maps.places.PlaceSearchRequest = {
          location: this.getLatLng(coords),
          radius: 2 * 1609.34,
          types: [grocery],
          bounds: undefined,
          keyword: undefined,
          name: undefined,
          rankBy: undefined
        };
        placeService.nearbySearch(searchRequest, (results: google.maps.places.PlaceResult[],
          status: google.maps.places.PlacesServiceStatus) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results.filter(f => f.types.indexOf(grocery) > -1));
          } else {
            reject(status.toString());
          }
        });
      });
  }

  public getCurrentPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): void {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);
  }

  private getLatLng(coords: Coordinates): google.maps.LatLng {
    return new google.maps.LatLng(coords.latitude, coords.longitude, true);
  }
}

@Injectable()
export class LocalGeoCoder extends AbstractGeoCoder {
  public computeDistanceBetween(from: Coordinates, to: Coordinates): number {
    const x1: number = from.longitude;
    const x2: number = to.longitude;
    const y1: number = from.latitude;
    const y2: number = to.latitude;
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }
  public getAddress(coords: Coordinates, done: (s: string) => void, fail: (s: google.maps.GeocoderStatus) => void): void {
    if (coords.latitude < 0) {
      fail(google.maps.GeocoderStatus.INVALID_REQUEST);
    }
    setTimeout(() => done(`Fun Address at ${coords.latitude.toString()},${coords.longitude.toString()}`), 3000);
  }
  public nearbyStoreSearch(coords: Coordinates): Promise<google.maps.places.PlaceResult[]> {

    function makePlace(ks: IDtoStore, n: number): google.maps.places.PlaceResult {
      const spot: Coordinates = {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: coords.latitude + (n * 2),
        longitude: coords.longitude + (n * 2),
        speed: 0
      };
      return {
        address_components: [],
        aspects: [],
        formatted_address: `formatted_address ${n}`,
        formatted_phone_number: `formatted_phone_number ${n}`,
        geometry: {
          location: new google.maps.LatLng(spot.latitude, spot.longitude),
          viewport: undefined
        },
        html_attributions: [],
        icon: "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
        international_phone_number: `international_phone_number ${n}`,
        name: `${ks.name} S${n}`,
        permanently_closed: false,
        photos: [
          {
            height: 200,
            width: 200,
            html_attributions: [],
            getUrl: (_opts) => "https://lh3.googleusercontent.com/-DiA7-qunhnQ/Vtmao0iSekI/AAAAAAAAAB0"
              + "/Eo1ypD8vvuQWt_Yy9Z3sLgzrBPRhY_wBA/w320-h300-k/"
          }],
        place_id: ks.place_id,
        price_level: undefined,
        rating: undefined,
        reviews: [],
        types: ["grocery_or_supermarket", "fake", "store"],
        url: `url ${n}`,
        vicinity: ks.vicinity,
        website: `website ${n}`
      };
    }

    const knownStores: IDtoStore[] = [
      {
        "id": "S-KOBIM",
        "name": "Schnucks",
        "place_id": "ChIJ43DkSEvU2IcRgU4nzYWcNU0",
        "vicinity": "15425 Manchester Road, Ballwin"
      },
      {
        "id": "S-f2jIj",
        "name": "Big Lots",
        "place_id": "ChIJQ9yAC2zU2IcR4fcxoawalqI",
        "vicinity": "14850 Manchester Road, Ballwin"
      },
      {
        "id": "S-F5TXz",
        "name": "Schnucks",
        "place_id": "ChIJ0-z4P9jT2IcRbt566e0iJIY",
        "vicinity": "1393 Big Bend Road #1, Ballwin"
      }
    ];

    const otherPlaces: google.maps.places.PlaceResult[] = [3, 4, 5].map(ndx => makePlace({
      "id": `s${ndx}`,
      "name": `STORE ${ndx}`,
      "place_id": `GP${ndx}`,
      "vicinity": `Vicinity ${ndx}`
    }, ndx));

    const fakePlaces: google.maps.places.PlaceResult[] = knownStores.map(makePlace);

    return new Promise<google.maps.places.PlaceResult[]>(
      (resolve) => {
        window.setTimeout(
          () => {
            resolve(flatten([fakePlaces, otherPlaces]));
          },
          200);
      });
  }

  public getCurrentPosition(successCallback: PositionCallback, _errorCallback?: PositionErrorCallback, _options?: PositionOptions): void {
    const hhCoords: Coordinates = {
      altitudeAccuracy: 0,
      longitude: -90.55149092347412,
      latitude: 38.575547947584255,
      speed: 0,
      heading: 0,
      altitude: 0,
      accuracy: 0
    };
    successCallback({ coords: hhCoords, timestamp: undefined });

    // setTimeout(() => successCallback({ coords: hhCoords, timestamp: undefined }), 1000);
  }
}
