import {Injectable} from "@angular/core";

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
                    radius: 3 * 1609.34,
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
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    }

    private getLatLng(coords: Coordinates): google.maps.LatLng {
        return new google.maps.LatLng(coords.latitude, coords.longitude, true);
    }
}

class FakeLatLng {
    constructor(private coords: Coordinates) {

    }
    public lat(): number {
        return this.coords.latitude;
    }
    public lng(): number {
        return this.coords.longitude;
    }
    public equals(): boolean {
        return true;
    }
    public toUrlValue(): string {
        return undefined;
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
        // fail(google.maps.GeocoderStatus.INVALID_REQUEST);
        setTimeout(() => done(`Fun Address at ${coords.latitude.toString()},${coords.longitude.toString()}`), 3000);
    }
    public nearbyStoreSearch(coords: Coordinates): Promise<google.maps.places.PlaceResult[]> {
        const fakePlaces: google.maps.places.PlaceResult[] = [0, 1, 2, 3, 4, 5].map(n => {
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
                    location: new FakeLatLng(spot),
                    viewport: new google.maps.LatLngBounds()
                },
                html_attributions: [],
                icon: "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
                international_phone_number: `international_phone_number ${n}`,
                name: `store ${n}`,
                permanently_closed: false,
                photos: [],
                place_id: `GP${n}`,
                price_level: undefined,
                rating: undefined,
                reviews: [],
                types: ["grocery_or_supermarket", "fake", "store"],
                url: `url ${n}`,
                vicinity: `vicinity ${n}`,
                website: `website ${n}`
            };
        });

        return new Promise<google.maps.places.PlaceResult[]>(
            (resolve, reject) => {
                window.setTimeout(
                    () => {
                        resolve(fakePlaces);
                    },
                    2000);
            });
    }

    public getCurrentPosition(successCallback: PositionCallback, errorCallback?: PositionErrorCallback, options?: PositionOptions): void {
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
