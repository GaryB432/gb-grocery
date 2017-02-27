import { AbstractGeoCoder, LocalGeoCoder } from "./geocoding.service";

describe("Local Geocoder", () => {
  it("should compute pythagorean distance", () => {
    const g: AbstractGeoCoder = new LocalGeoCoder();
    const x1: Coordinates = {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 8,
      longitude: 6,
      speed: 0
    };
    const x2: Coordinates = {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 5,
      longitude: 10,
      speed: 0
    };
    const expected: number = Math.sqrt(Math.pow((8 - 5), 2) + Math.pow((6 - 10), 2));
    expect(g.computeDistanceBetween(x1, x2)).toBe(expected);
  });
});
