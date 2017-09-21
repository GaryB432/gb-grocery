import { Place } from './place';

export abstract class AbstractGeoService {
  public abstract computeDistanceBetween(
    from: Coordinates,
    to: Coordinates,
    radius?: number
  ): number;

  public abstract async nearbyStoreSearch(
    coords: Coordinates
  ): Promise<Place[]>;

  public abstract async getCurrentPosition(
    options?: PositionOptions
  ): Promise<Position>;
}
