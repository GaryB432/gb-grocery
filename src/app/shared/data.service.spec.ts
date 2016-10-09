// https://github.com/krimple/angular2-webpack-demo-routing-and-http/blob/master/test/app/services/blog-service.spec.ts

import {DataService, LocalStorage} from "./data.service";

import {
    inject,
    async,
    TestBed
} from "@angular/core/testing";

import {IItem, IStore, ICheckout} from "./interfaces";
import {Checkout, Pickup, AppInfo} from "./models";

let items: IItem[] = [
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

let checkouts: ICheckout[] = [
    {
        "storeId": "S1",
        "isoDate": "2016-04-03T04:45:38.582Z",
        "pickups": [{ "itemId": "I1", "aisle": "K9" }, { "itemId": "I0", "aisle": "D10" }]
    },
    {
        "storeId": "S0",
        "isoDate": "2016-04-03T05:35:18.334Z",
        "pickups": [{ "itemId": "I0", "aisle": "D10" }]
    }
];

let stores: IStore[] = [
    {
        "formatted_address": "formatted_address",
        "formatted_phone_number": "formatted_phone_number",
        "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png",
        "location": {
            "altitudeAccuracy": 0,
            "longitude": 301,
            "latitude": 300,
            "speed": 0,
            "heading": 0,
            "altitude": 0,
            "accuracy": 0
        },
        "name": "FAKE SCHNUCKS",
        "types": ["grocery_or_supermarket"],
        "url": "url",
        "website": "website",
        "vicinity": "vicinity",
        "place_id": "xxxxxxxxxxxxx",
        "id": "S0"
    },
    {
        "formatted_address": "formatted_address",
        "formatted_phone_number": "formatted_phone_number",

        "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png",
        "location": {
            "altitudeAccuracy": 0,
            "longitude": -90.51309529999997,
            "latitude": 38.593912,
            "speed": 0,
            "heading": 0,
            "altitude": 0,
            "accuracy": 0
        },
        "name": "Zabihah",
        "place_id": "ChIJsUfNv0jU2IcRk9KkjfWbBC0",
        "types": ["grocery_or_supermarket", "food", "store", "point_of_interest", "establishment"],
        "url": "url",
        "website": "website",
        "vicinity": "14345 Manchester Road, Ballwin",
        "id": "S1"
    }
];

class MockLocalStorage {
    private data: { [key: string]: string; } = {};
    constructor() {
        this.data["gbg-items"] = JSON.stringify(items);
        this.data["gbg-stores"] = JSON.stringify(stores);
        this.data["gbg-checkouts"] = JSON.stringify(checkouts);
    }
    public getItem(key: string): any {
        return this.data[key];
    }
    public removeItem(key: string): void {
        this.data[key] = undefined;
    }
    public setItem(key: string, data: string): void {
        this.data[key] = data;
    }
}

describe("Data Service", () => {
    type CallMap = { [year: string]: any };
    type kvp = { k: string, v: string };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: LocalStorage, useClass: MockLocalStorage },
                DataService
            ]
        });
    });

    describe("Uses Storage", () => {
        it("adds checkout", async(inject([DataService, LocalStorage], (sut: DataService, ls: MockLocalStorage) => {
            const getItem: jasmine.Spy = spyOn(ls, "getItem").and.callThrough();
            const setItem: jasmine.Spy = spyOn(ls, "setItem").and.callThrough();

            return sut.load().then((info: AppInfo) => {
                expect(setItem).not.toHaveBeenCalled();
                getItem.calls.reset();

                const co: Checkout = new Checkout(info.stores[1], new Date(2001, 2, 3, 4, 5));
                co.pickups = [
                    new Pickup(info.items[1], "aisle1"),
                    new Pickup(info.items[0], undefined)
                ];

                sut.addCheckout(co).then(
                    (postco: Checkout) => {
                        const dataCalls: CallMap = setItem.calls.allArgs().map(
                            (v: [string, string]) => {
                                return { k: v[0], v: v[1] };
                            }).reduce<CallMap>(
                            (cmap: CallMap, c: kvp) => {
                                cmap[c.k] = JSON.parse(c.v);
                                return cmap;
                            },
                            {});

                        expect(dataCalls["gbg-checkouts"].length).toBe(3);
                        expect(postco.date).toEqual(new Date(2001, 2, 3, 4, 5));
                        expect(postco.pickups.map((p: Pickup) => p.aisle)).toEqual(["aisle1", undefined]);

                        expect(dataCalls["gbg-items"].length).toBe(3);
                        expect(getItem).not.toHaveBeenCalled();
                    });
            });
        })));

        it("clears all data", inject([DataService, LocalStorage], (sut: DataService, ls: MockLocalStorage) => {
            const getItem: jasmine.Spy = spyOn(ls, "getItem").and.callThrough();
            const setItem: jasmine.Spy = spyOn(ls, "setItem").and.callThrough();
            const removeItem: jasmine.Spy = spyOn(ls, "removeItem").and.callThrough();

            sut.clearAll();
            expect(removeItem.calls.allArgs()).toEqual([
                ["gbg-checkouts"], ["gbg-stores"], ["gbg-items"]
            ]);
            expect(getItem).not.toHaveBeenCalled();
            expect(setItem).not.toHaveBeenCalled();
        }));

        it("loads", async(inject([DataService, LocalStorage], (sut: DataService, ls: MockLocalStorage) => {
            const getItem: jasmine.Spy = spyOn(ls, "getItem").and.callThrough();
            const setItem: jasmine.Spy = spyOn(ls, "setItem").and.callThrough();

            return sut.load().then((info: AppInfo) => {
                expect(info).toBeDefined();
                expect(getItem.calls.allArgs()).toEqual([
                    ["gbg-items"], ["gbg-stores"], ["gbg-checkouts"]
                ]);
                expect(setItem).not.toHaveBeenCalled();
            });
        })));

    });

});
