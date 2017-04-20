import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { DataService } from "../shared/data.service";
import { LogicService } from "../shared/logic.service";
import { AppInfo } from "../shared/models";
import { AbstractGeoCoder, LocalGeoCoder } from "./geocoding.service";
import { StoreComponent } from "./store.component";

// class MockLogicService {
//   private info: AppInfo = {
//     stores: undefined,
//     items: undefined,
//     checkouts: undefined
//   };

//   public load(): Promise<AppInfo> {
//     const today: Date = new Date(2034, 5, 6);

//     this.info.stores = [new Store("1", "ONE"), new Store("2", "TWO")];
//     this.info.items = ["A", "B"].map((s) => {
//       const item: Item = new Item();
//       item.id = s;
//       item.name = `ITEM ${s}`;
//       return item;
//     });
//     this.info.checkouts = [new Checkout(this.info.stores[0], today)];
//     return new Promise<AppInfo>((resolve, reject) => resolve(this.info));
//   }
//   public getStoresFromNearbyPlaces(places: google.maps.places.PlaceResult[]): Store[] {
//     throw new Error("oh noes");
//     // return [];
//   }
// }

// class MockLocalStorage {
//   public setItem: jasmine.Spy = jasmine.createSpy("setItem");
//   public getItem: jasmine.Spy = jasmine.createSpy("getItem");
// }

class MockDataService {
  public load(): Promise<AppInfo> {
    return Promise.resolve(undefined);
  }
}
class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy("navigate");
}
xdescribe("Store Component", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StoreComponent
      ],
      imports: [
        FormsModule
      ],
      providers: [
        { provide: LogicService, useClass: LogicService },
        { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter }
      ]
    });
  });

  it("should have aisles", async(() => {
    // Overrides here, if you need them
    TestBed.overrideComponent(StoreComponent, {
      set: {
        template: "<div>Overridden template something here</div>",
      }
    });

    TestBed.compileComponents().then(() => {
      const fixture: ComponentFixture<StoreComponent> = TestBed.createComponent(StoreComponent);

      // Access the dependency injected component instance
      const app: StoreComponent = fixture.componentInstance;

      // app.ngOnInit();

      // it("should have aisles", () => {
      //     const fixture: ComponentFixture<StoreComponent> = TestBed.createComponent(StoreComponent);
      //     // const component: StoreComponent = fixture.componentInstance;

      //     // component.pickup = new Pickup(new Item(), "A1");
      //     // function newStore() {
      //     //     return new Store("a", undefined)
      //     // };
      //     // let s: Store = {
      //     //     formattedAddress: "a",
      //     //     formattedPhoneNumber: "B"
      //     // };
      //     // component.stores = [new Store("A", undefined)];
      //     // component.selectedStorePlaceId = "1";
      //     // component.changeStore();

      //     // fixture.detectChanges();

      //     // expect(component.aisles.length).toBeGreaterThan(0);

      //     expect(fixture.nativeElement.children[0].textContent).toContain("hi");
      // });

      expect(app.aisles).toBeDefined();

      // Access the element
      const element: Element = fixture.nativeElement;

      // Detect changes as necessary
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(element.textContent).toContain("something");
      });

    });
  }));
});

// import { TestBed, ComponentFixture } from "@angular/core/testing";
// import { FormsModule } from "@angular/forms";
// import { Router } from "@angular/router";

// describe("Hey Store component", () => {
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [FormsModule],
//             declarations: [StoreComponent],
//             providers: [
//                 { provide: LogicService, useClass: MockLogicService },
//                 { provide: AbstractGeoCoder, useClass: MockGeoCoder },
//                 { provide: Router, useClass: MockRouter }
//             ]

//         });
//         TestBed.overrideComponent(StoreComponent, { set: { template: "<div><gbg-store></gbg-store></div>" } });
//     });

//     it("should have aisles", () => {
//         const fixture: ComponentFixture<StoreComponent> = TestBed.createComponent(StoreComponent);
//         // const component: StoreComponent = fixture.componentInstance;

//         // component.pickup = new Pickup(new Item(), "A1");
//         // function newStore() {
//         //     return new Store("a", undefined)
//         // };
//         // let s: Store = {
//         //     formattedAddress: "a",
//         //     formattedPhoneNumber: "B"
//         // };
//         // component.stores = [new Store("A", undefined)];
//         // component.selectedStorePlaceId = "1";
//         // component.changeStore();

//         // fixture.detectChanges();

//         // expect(component.aisles.length).toBeGreaterThan(0);

//         expect(fixture.nativeElement.children[0].textContent).toContain("hi");
//     });

// });

// describe("Store Component", () => {

//     // const mockRouter = new MockRouter();

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             imports: [FormsModule],
//             declarations: [StoreComponent],
//             providers: [
//                 { provide: LogicService, useClass: MockLogicService },
//                 { provide: AbstractGeoCoder, useClass: MockGeoCoder },
//                 { provide: Router, useClass: MockRouter }
//                 // { provide: Router, useValue: mockRouter }
//             ]

//         });

//         TestBed.overrideComponent(StoreComponent, { set: { template: "<div>hi</div>" } });

//     });

//     it("should test cool stuff", () => {
//         const fixture: ComponentFixture<StoreComponent> = TestBed.createComponent(StoreComponent);
//         const component: StoreComponent = fixture.componentInstance;

//         component.newName = "Come up and test me some time";

//         fixture.detectChanges();

//         expect(fixture.nativeElement.children[0].textContent).toContain("hi");
//     });

// });

// // /// <reference path="../../../../typings/main/ambient/google.maps/index.d.ts" />

// // import {
// //     BaseRequestOptions,
// //     Response,
// //     ResponseOptions,
// //     ConnectionBackend,
// //     Http
// // } from 'angular2/http';

// // import {
// //     it,
// //     expect,
// //     describe,
// //     beforeEachProviders,
// //     inject,
// //     injectAsync
// // } from 'angular2/testing';

// // import {provide} from 'angular2/core';

// // namespace googlex.maps {
// //     export class LatLng {
// //         constructor(private _lat: number, private _lng: number, noWrap?: boolean) { }
// //         equals(other: LatLng): boolean { return this._lat === other._lat && this._lng === other._lng; }
// //         lat(): number { return this._lat; }
// //         lng(): number { return this._lng; }
// //         toString(): string { return "TBD"; }
// //         toUrlValue(precision?: number): string { return "TBD"; }
// //     }
// //     export class LatLngBounds {

// //     }
// //     export enum GeocoderStatus {
// //         ERROR,
// //         INVALID_REQUEST,
// //         OK,
// //         OVER_QUERY_LIMIT,
// //         REQUEST_DENIED,
// //         UNKNOWN_ERROR,
// //         ZERO_RESULTS
// //     }

// //     export namespace places {
// //         export class PlaceResult { }
// //     }
// // }

// // import {DataService, AppInfo, LocalStorage} from "../../services/data/data-service";
// // import {GeoCoder} from "../../services/google/geocoding";
// // import {StoreComponent} from "./store";
// // import {Item, Store, Checkout} from "../../datatypes/all";

// // let hhCoords: Coordinates = {
// //     altitudeAccuracy: 0,
// //     longitude: -90.55149092347412,
// //     latitude: 38.575547947584255,
// //     speed: 0,
// //     heading: 0,
// //     altitude: 0,
// //     accuracy: 0
// // };

// // function computeDistanceBetween(from: Coordinates, to: Coordinates, radius?: number): number {
// //     let x = from.longitude - to.longitude;
// //     let y = from.latitude - to.latitude;
// //     let n = Math.pow(x, 2) + Math.pow(y, 2);
// //     let d = Math.sqrt(n);
// //     return d;
// // }

// // function fiveFakePlaces(): any[] {
// //     return [0, 1, 2, 3, 4].map(n => {
// //         let spot: Coordinates = {
// //             accuracy: 0,
// //             altitude: 0,
// //             altitudeAccuracy: 0,
// //             heading: 0,
// //             latitude: hhCoords.latitude + (n * 2),
// //             longitude: hhCoords.longitude + (n * 2),
// //             speed: 0
// //         };
// //         return {
// //             address_components: [],
// //             aspects: [],
// //             formatted_address: `formatted_address ${n}`,
// //             formatted_phone_number: `formatted_phone_number ${n}`,
// //             geometry: {
// //                 location: new googlex.maps.LatLng(hhCoords.latitude + (n * 20), hhCoords.longitude + (n * 20)),
// //                 viewport: undefined
// //             },
// //             html_attributions: [],
// //             icon: "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
// //             international_phone_number: `international_phone_number ${n}`,
// //             name: `name ${n}`,
// //             permanently_closed: false,
// //             photos: [],
// //             place_id: `GP${n}`,
// //             price_level: undefined,
// //             rating: undefined,
// //             reviews: [],
// //             types: ["grocery_or_supermarket", "fake", "store"],
// //             url: `url ${n}`,
// //             vicinity: `vicinity ${n}`,
// //             website: `website ${n}`
// //         };
// //     });

// // }

// // describe('Testing the Store component', () => {
// //     class MockLocalStorage {

// //     }
// //     class MockDataService {

// //     }
// //     class MockGeocoder {

// //         // public getAddress(coords: Coordinates, done: (s: string) => void, fail: (s: google.maps.GeocoderStatus) => void): void {
// //         //     throw new Error("Not today");
// //         // }
// //         // public nearbyStoreSearch(coords: Coordinates): Promise<google.maps.places.PlaceResult[]> {

// //         //     return new Promise<google.maps.places.PlaceResult[]>(
// //         //         (resolve, reject) => {
// //         //             window.setTimeout(
// //         //                 () => {
// //         //                     resolve(fakePlaces);
// //         //                 },
// //         //                 5000);
// //         //         });
// //         // }

// //         // public getLatLng(coords: Coordinates): google.maps.LatLng {
// //         //     return new google.maps.LatLng(coords.latitude, coords.longitude, true);
// //         // }
// //     }

// //     let fakePlaces: google.maps.places.PlaceResult[];

// //     beforeEachProviders(() => {
// //         return [
// //             provide(DataService, { useClass: MockDataService }),
// //             provide(LocalStorage, { useClass: MockLocalStorage }),
// //             provide(GeoCoder, { useClass: MockGeocoder }),
// //             DataService,
// //             StoreComponent
// //         ]
// //     });

// //     beforeEach(() => {
// //         fakePlaces = fiveFakePlaces();
// //         expect(fakePlaces.every((fp: google.maps.places.PlaceResult) => fp.place_id != "")).toBeTruthy();
// //     });

// //     it('should get nearby stores', inject([StoreComponent, GeoCoder, DataService, LocalStorage],
// //         (sut: StoreComponent, geo: MockGeocoder, ds: MockDataService, ls: MockLocalStorage) => {

// //         let stores = [0, 1, 2, 3, 4].map(n => new Store(`S${n}`, `Store ${n}`));

// //         expect(stores.every(s => s.placeId === void 0)).toBeTruthy();

// //         // sut.ngOnInit();

// //         // stores[2].placeId = "fg";

// //         let store = sut.getStoreReference(fakePlaces[0], stores);

// //         expect(store).toBeDefined();

// //         expect(store.id).toBeUndefined();

// //     }));

// //     it('should get existing reference for place_id', inject([StoreComponent, GeoCoder, DataService, LocalStorage],
// //         (sut: StoreComponent, geo: MockGeocoder, ds: MockDataService, ls: MockLocalStorage) => {

// //         let stores = [0, 1, 2, 3, 4].map(n => new Store(`S${n}`, `Store ${n}`));

// //         let fakePlace = <google.maps.places.PlaceResult>fakePlaces[3];

// //         let oneStore = stores[2];

// //         oneStore.placeId = fakePlace.place_id;

// //         let foundStore = sut.getStoreReference(fakePlace, stores);

// //         expect(foundStore).toBe(oneStore);

// //         expect(oneStore.id).toBe("S2");

// //     }));

// //     it('should get existing reference for place_id', inject([StoreComponent, GeoCoder, DataService, LocalStorage],
// //         (sut: StoreComponent, geo: MockGeocoder, ds: MockDataService, ls: MockLocalStorage) => {

// //         let stores = [0, 1, 2, 3, 4].map(n => new Store(`S${n}`, `Store ${n}`));

// //         // let fakePlace = <google.maps.places.PlaceResult>fakePlaces[3];

// //         // let oneStore = stores[2];

// //         // oneStore.placeId = fakePlace.place_id;

// //         let sortedStores = sut.getStoresForNearbyPlaces(fakePlaces, stores, c => computeDistanceBetween(hhCoords, c));

// //         expect(sortedStores.map(s => { return { name: s.name, id: s.id, placeId: s.placeId }; }))
// //             .toEqual([
// //                 { name: "name 0", id: undefined, placeId: "GP0" },
// //                 { name: "name 1", id: undefined, placeId: "GP1" },
// //                 { name: "name 2", id: undefined, placeId: "GP2" },
// //                 { name: "name 3", id: undefined, placeId: "GP3" },
// //                 { name: "name 4", id: undefined, placeId: "GP4" }
// //             ]);

// //         // expect(foundStore).toBe(oneStore);

// //         // expect(oneStore.id).toBe("S2");

// //     }));
// // });
