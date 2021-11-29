import { Place } from './place';

export abstract class AbstractGeoService {
  public abstract computeDistanceBetween(
    from: GeolocationCoordinates,
    to: GeolocationCoordinates,
    radius?: number
  ): number;

  public abstract nearbyStoreSearch(
    coords: GeolocationCoordinates
  ): Promise<Place[]>;

  public abstract getPlaceDetails(placeId: string): Promise<Partial<Place>>;

  public abstract getCurrentPosition(
    options?: PositionOptions
  ): Promise<GeolocationPosition>;
}
