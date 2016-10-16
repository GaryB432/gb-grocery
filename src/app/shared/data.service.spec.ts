// http://gist.asciidoctor.org/?github-mraible%2Fng2-demo%2F%2FREADME.adoc#_unit_test_the_searchservice

import { TestBed, inject, tick, fakeAsync } from "@angular/core/testing";
// import { LogicService } from "./logic.service";
// import { BaseRequestOptions, Http, ConnectionBackend, Response, ResponseOptions } from "@angular/http";
// import { MockBackend } from "@angular/http/testing";

import { DataIoService } from "../shared/data.io.service";
import { DataService } from "../shared/data.service";
import { IDtoAppInfo, IItem, IDtoStore, ICheckout } from "../shared/interfaces";
import { AppInfo } from "../shared/models";

// class MockDataService {
//     public load(): Promise<AppInfo> {
//         const fixture: AppInfo = {
//             stores: [],
//             items: [],
//             checkouts: []
//         };
//         return Promise.resolve(fixture);
//     }
// }

const items: IItem[] = [
    {
        "id": "I0",
        "name": "asdf",
        "needed": false
    },
    {
        "id": "I1",
        "name": "zebra",
        "needed": true
    },
    {
        "id": "I2",
        "name": "another",
        "needed": false
    }
];

const checkouts: ICheckout[] = [
    {
        "storeId": "S1",
        "isoDate": "2016-04-03T04:45:38.582Z",
        "pickups": [{ "itemId": "I1", "aisle": "K9" }, { "itemId": "I0", "aisle": "D10" }]
    },
    {
        "storeId": "S0",
        "isoDate": "2016-04-03T05:35:18.334Z",
        "pickups": [{ "itemId": "I0", "aisle": "S0-D10" }]
    }
];

const stores: IDtoStore[] = [
    {
        // "formatted_address": "formatted_address",
        // "formatted_phone_number": "formatted_phone_number",
        // "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        // "location": {
        //     "altitudeAccuracy": 0,
        //     "longitude": 301,
        //     "latitude": 300,
        //     "speed": 0,
        //     "heading": 0,
        //     "altitude": 0,
        //     "accuracy": 0
        // },
        "name": "FAKE SCHNUCKS",
        // "types": ["grocery_or_supermarket"],
        // "url": "url",
        // "website": "website",
        "vicinity": "vicinity",
        "place_id": "xxxxxxxxxxxxx",
        "id": "S0"
    },
    {
        // "formatted_address": "formatted_address",
        // "formatted_phone_number": "formatted_phone_number",

        // "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
        // "location": {
        //     "altitudeAccuracy": 0,
        //     "longitude": -90.51309529999997,
        //     "latitude": 38.593912,
        //     "speed": 0,
        //     "heading": 0,
        //     "altitude": 0,
        //     "accuracy": 0
        // },
        "name": "Atlantic Mills",
        "place_id": "ChIJsUfNv0jU2IcRk9KkjfWbBC0",
        // "types": ["grocery_or_supermarket", "food", "store", "point_of_interest", "establishment"],
        // "url": "url",
        // "website": "website",
        "vicinity": "14345 Manchester Road, Ballwin",
        "id": "S1"
    }
];

class MockDataIoService {
    public load(): Promise<IDtoAppInfo> {
        return Promise.resolve({ stores, items, checkouts });
    }
}

describe("Data Service", () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: DataService, useClass: DataService, deps: [DataIoService] },
                { provide: DataIoService, useClass: MockDataIoService }
            ]
        });

    });

    it("should load",
        inject([DataService, DataIoService], fakeAsync((sut: DataService) => {
            let info: AppInfo;
            sut.load().then((response: AppInfo) => {
                info = response;
            });
            tick();
            expect(info).toBeDefined();
            expect(info.stores.length).toBe(2);
            expect(info.items.length).toBe(3);
            expect(info.checkouts.length).toBe(2);

            expect(info.checkouts[0].store).toBe(info.stores[1]);
            expect(info.checkouts[0].pickups.map(p => p.item)).toEqual([info.items[1], info.items[0]]);
            expect(info.checkouts[0].pickups.length).toEqual(2);

            expect(info.items[0].checkouts).toBeDefined();
            expect(info.items[0].checkouts.length).toBe(0);
        }))
    );

});

// // https://github.com/krimple/angular2-webpack-demo-routing-and-http/blob/master/test/app/services/blog-service.spec.ts

// import { LogicService } from "./logic.service";

// import {
//     async,
//     inject,
//     TestBed
// } from "@angular/core/testing";

// const flatten: (a: any[][]) => any[] = require("arr-flatten");

// import {
//     LocalIoStorage,
//     DataService,
//     DataIoService,
//     IItem,
//     IDtoStore,
//     ICheckout,
//     Item,
//     Store,
//     Checkout,
//     Pickup,
//     AppInfo
// } from "../shared";

// class MockLocalStorage {
//     private data: { [key: string]: string; } = {};
//     constructor() {
//         this.data["gbg-items"] = JSON.stringify(items);
//         this.data["gbg-stores"] = JSON.stringify(stores);
//         this.data["gbg-checkouts"] = JSON.stringify(checkouts);
//     }
//     public getItem(key: string): any {
//         return this.data[key];
//     }
//     public removeItem(key: string): void {
//         this.data[key] = undefined;
//     }
//     public setItem(key: string, data: string): void {
//         this.data[key] = data;
//     }
// }

// class LatLng {
//     constructor(private coords: Coordinates) {
//     }
//     public lat(): number {
//         return this.coords.latitude;
//     }
//     public lng(): number {
//         return this.coords.longitude;
//     }
//     public equals(other: LatLng): boolean {
//         return this.lng() === other.lng() && this.lat() === other.lat();
//     }
//     public toUrlValue(): string {
//         return `${this.lat()},${this.lng()}`;
//     }
// }

// describe("Logic Service", () => {

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 { provide: LocalIoStorage, useClass: MockLocalStorage },
//                 DataService,
//                 // DataIoService,
//                 LogicService
//             ]
//         });
//     });

//     it("should get items", async(inject([LogicService], (sut: LogicService) => {
//         return sut.load().then((info: AppInfo) => {
//             expect(info).toBeDefined();
//             expect(info.stores.length).toBe(2);
//             expect(info.items.length).toBe(3);
//             expect(info.checkouts.length).toBe(2);

//             expect(info.checkouts[0].store).toBe(info.stores[1]);
//             expect(info.checkouts[0].pickups.map(p => p.item)).toEqual([info.items[1], info.items[0]]);
//             expect(info.checkouts[0].pickups.length).toEqual(2);

//             expect(info.items[0].checkouts.map(c => c.store.name)).toEqual(["Atlantic Mills", "FAKE SCHNUCKS"]);
//         });
//     })));

//     xit("should create item", async(inject([LogicService], (sut: LogicService) => {
//         return sut.load().then((info: AppInfo) => {
//             sut.insertItem("tester").then(item => {
//                 expect(item.id).not.toBeUndefined();
//                 expect(items.find(i => i.id === item.id)).toBeUndefined();
//                 expect(item.name).toBe("tester");
//                 expect(item.needed).toBe(true);
//             });
//         });
//     })));

//     xit("should get item", async(inject([LogicService], (sut: LogicService) => {
//         return sut.load().then((info: AppInfo) => {
//             return sut.getItem("I1").then(item => {
//                 expect(item).toBe(info.items.find(f => f.id === item.id));
//                 expect(item.checkouts.length).toBe(1);
//                 expect(item.name).toBe("zebra");
//                 expect(item.needed).toBe(true);
//             });
//         });
//     })));

//     xit("should not delete nonexisting item", async(inject([LogicService], (sut: LogicService) => {
//         return sut.load().then((info: AppInfo) => {
//             const loaded: AppInfo = info;
//             const doomed: Item = new Item();
//             doomed.id = "wtf";
//             sut.deleteItem(doomed, loaded).catch(r => {
//                 expect(r).toBe("No item wtf to delete");
//             });
//         });
//     })));

//     xit("should delete item", async(inject([LogicService, DataService], (sut: LogicService, ds: DataService) => {
//         const saveCheckouts: jasmine.Spy = spyOn(ds, "saveCheckouts").and.callThrough();
//         const saveItems: jasmine.Spy = spyOn(ds, "saveItems").and.callThrough();
//         return sut.load().then((info: AppInfo) => {
//             const loaded: AppInfo = info;
//             const doomed: Item = loaded.items[1];
//             sut.deleteItem(doomed, loaded).then(actual => {
//                 expect(actual.items.length).toBe(2);
//                 expect(actual.items.find(i => i.id === doomed.id)).toBeUndefined();

//                 const checkoutsIds: string[][] = loaded.checkouts
//                     .map(co => co.pickups
//                         .map(i => i.item.id));
//                 const checkedOutItemIds: string[] = flatten(checkoutsIds);
//                 expect(checkedOutItemIds.find(i => i === doomed.id)).toBeUndefined();
//                 expect(saveItems).toHaveBeenCalledTimes(1);
//                 expect(saveCheckouts).toHaveBeenCalledTimes(1);
//             });
//         });
//     })));

//     xit("should update stores from places", async(inject(
//         [LogicService, LocalIoStorage],
//         (sut: LogicService, ls: MockLocalStorage) => {
//             const setItem: jasmine.Spy = spyOn(ls, "setItem").and.callThrough();
//             const storePhoto: jasmine.Spy = jasmine.createSpy("getUrl").and.returnValue("photo url");

//             return sut.load().then((info: AppInfo) => {

//                 const hh: Coordinates = {
//                     accuracy: undefined,
//                     altitude: undefined,
//                     altitudeAccuracy: undefined,
//                     heading: undefined,
//                     latitude: 10,
//                     longitude: 10,
//                     speed: undefined
//                 };

//                 const places: google.maps.places.PlaceResult[] = ["ChIJsUfNv0jU2IcRk9KkjfWbBC0", "wtf"]
//                     .map((pid: string, n: number) => {
//                         return {
//                             address_components: [],
//                             aspects: [],
//                             formatted_address: undefined,
//                             formatted_phone_number: undefined,
//                             geometry: {
//                                 location: new LatLng(hh),
//                                 viewport: undefined
//                             },
//                             html_attributions: [],
//                             icon: `new icon ${n}`,
//                             international_phone_number: undefined,
//                             name: `new name ${n}`,
//                             permanently_closed: false,
//                             photos: [
//                                 {
//                                     height: 100,
//                                     html_attributions: [],
//                                     width: 100,
//                                     getUrl: storePhoto
//                                 }
//                             ],
//                             place_id: pid,
//                             price_level: undefined,
//                             rating: undefined,
//                             reviews: [],
//                             types: [],
//                             url: undefined,
//                             vicinity: `new vicinity ${n}`,
//                             website: undefined
//                         };
//                     });

//                 const actual: Store[] = sut.getStoresFromNearbyPlaces(places);

//                 expect(actual.length).toBe(2);

//                 expect(storePhoto).toHaveBeenCalledTimes(2);

//                 const res: string =
//                     "[{\"id\":\"S0\",\"name\":\"FAKE SCHNUCKS\",\"place_id\":\"x"
//                     + "xxxxxxxxxxxx\",\"vicinity\":\"vicinity\"},{\"id\":\"S1\",\""
//                     + "name\":\"new name 0\",\"place_id\":\"ChIJsUfNv0jU2IcRk9Kk"
//                     + "jfWbBC0\",\"vicinity\":\"new vicinity 0\"}]";

//                 expect(setItem).toHaveBeenCalledWith("gbg-stores", res);

//             });
//         })));

//     it("should predict aisle properly", () => {

//         const store: Store = new Store("S", undefined);

//         const item: Item = new Item();
//         item.id = "I0";
//         item.checkouts = [
//             new Checkout(store, new Date(2001, 2, 3, 4, 5, 6)),
//             new Checkout(store, new Date(2001, 2, 4, 4, 5, 6))
//         ];
//         item.checkouts[0].pickups = [new Pickup(item, "2-3")];
//         item.checkouts[1].pickups = [new Pickup(item, "2-4")];

//         expect(LogicService.predictAisle(item, store)).toBe("2-4");
//     });

// });

// describe("More Logic Service", () => {
//     const info: AppInfo = new AppInfo();

//     info.stores = [0, 1, 2, 3].map(n => {
//         return new Store(`S${n}`, `STORE ${n}`);
//     });

//     info.items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
//         const item: Item = {
//             id: `I${n}`,
//             name: `ITEM ${n}`,
//             needed: false,
//             checkouts: []
//         };
//         return item;
//     });

//     it("should get store aisles", () => {

//         const bobs: Store = info.stores[0];
//         const ralphs: Store = info.stores[1];

//         info.checkouts = [
//             {
//                 date: undefined,
//                 store: ralphs,
//                 pickups: [
//                     { item: info.items[0], aisle: "11c", picked: undefined },
//                     { item: info.items[2], aisle: "11a", picked: undefined }
//                 ]
//             },
//             {
//                 date: undefined,
//                 store: bobs,
//                 pickups: [
//                     { item: info.items[0], aisle: "765n", picked: undefined },
//                     { item: info.items[2], aisle: "926m", picked: undefined }
//                 ]
//             },
//             {
//                 date: undefined,
//                 store: ralphs,
//                 pickups: [
//                     { item: info.items[0], aisle: "11b", picked: undefined },
//                     { item: info.items[1], aisle: "11b", picked: undefined },
//                     { item: info.items[2], aisle: undefined, picked: undefined },
//                     { item: info.items[3], aisle: "11b", picked: undefined },
//                     { item: info.items[4], aisle: "11a", picked: undefined }
//                 ]
//             },
//             {
//                 date: undefined,
//                 store: bobs,
//                 pickups: [
//                     { item: info.items[0], aisle: "65n", picked: undefined },
//                     { item: info.items[1], aisle: "26m", picked: undefined },
//                     { item: info.items[2], aisle: "26m", picked: undefined }
//                 ]
//             },
//             {
//                 date: undefined,
//                 store: ralphs,
//                 pickups: [
//                     { item: info.items[0], aisle: "11c", picked: undefined },
//                     { item: info.items[0], aisle: "11b", picked: undefined },
//                     { item: info.items[2], aisle: "11a", picked: undefined }
//                 ]
//             }
//         ];

//         LogicService.project(info);

//         expect(LogicService.getStoreAisles(ralphs))
//             .toEqual([
//                 "11a", "11b", "11c"
//             ]);

//     });

//     it("should sort aisles", () => {
//         expect(LogicService.sortAisles([
//             "B", "10B", "2A", "A7", "10A", "A", "10", "A8", "2", "1", "2B", "1A"
//         ])).toEqual([
//             "1", "1A", "2", "2A", "2B", "10", "10A", "10B", "A", "A7", "A8", "B"
//         ]);
//     });

//     it("should sort empty aisles", () => {
//         expect(LogicService.sortAisles([])).toEqual([]);
//     });

//     it("should sort pickups", () => {

//         type PickupStarter = { name: string, aisle: string };

//         const setup: PickupStarter[] = [
//             { name: "A", aisle: "B" },
//             { name: "C", aisle: undefined },
//             { name: "G", aisle: "A" },
//             { name: "B", aisle: "C" },
//             { name: "E", aisle: undefined },
//             { name: "F", aisle: "A" },
//             { name: "D", aisle: undefined }
//         ];

//         const pickups: Pickup[] = setup.map(p => {
//             const item: Item = new Item();
//             item.id = `ID${p.name}`;
//             item.name = p.name;
//             return new Pickup(item, p.aisle);
//         });

//         expect(LogicService.sortPickups(pickups).map(p => p.item.name))
//             .toEqual([
//                 "F", "G", "A", "B", "C", "D", "E"
//             ]);
//     });

// });
