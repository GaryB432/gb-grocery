import { async, inject, TestBed } from "@angular/core/testing";

import { DataIoService } from "./data.io.service";
import { LocalIoStorage } from "./data.localstorage.service";
import * as Dto from "./dto";

const items: Dto.Item[] = [
  {
    id: "I0",
    name: "asdf",
    needed: false,
  },
  {
    id: "I1",
    name: "zebra",
    needed: true,
  },
  {
    id: "I2",
    name: "another",
    needed: false,
  },
];

const checkouts: Dto.Checkout[] = [
  {
    isoDate: "2016-04-03T04:45:38.582Z",
    pickups: [{ itemId: "I1", aisle: "K9" }, { itemId: "I0", aisle: "D10" }],
    storeId: "S1",
  },
  {
    isoDate: "2016-04-03T05:35:18.334Z",
    pickups: [{ itemId: "I0", aisle: "D10" }],
    storeId: "S0",
  },
];

const stores: Dto.Store[] = [
  {
    id: "S0",
    name: "FAKE SCHNUCKS",
    place_id: "xxxxxxxxxxxxx",
    vicinity: "vicinity",
  },
  {

    id: "S1",
    name: "Zabihah",
    place_id: "ChIJsUfNv0jU2IcRk9KkjfWbBC0",
    vicinity: "14345 Manchester Road, Ballwin",
  },
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

describe("Data IO Service", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LocalIoStorage, useClass: MockLocalStorage },
        DataIoService,
      ],
    });
  });
  it("should load", async(inject([DataIoService, LocalIoStorage], (sut: DataIoService, ls: MockLocalStorage) => {
    const getItem: jasmine.Spy = spyOn(ls, "getItem").and.callThrough();
    const setItem: jasmine.Spy = spyOn(ls, "setItem").and.callThrough();

    return sut.load().then((info: Dto.AppInfo) => {
      expect(info).toBeDefined();
      expect(getItem.calls.allArgs()).toEqual([
        ["gbg-checkouts"], ["gbg-items"], ["gbg-stores"],
      ]);
      expect(setItem).not.toHaveBeenCalled();

      expect(info.checkouts.length).toBe(2);
      expect(info.items.length).toBe(3);
      expect(info.stores.length).toBe(2);
    });
  })));

  it("should save all", async(inject([DataIoService, LocalIoStorage], (sut: DataIoService, ls: MockLocalStorage) => {
    const getItem: jasmine.Spy = spyOn(ls, "getItem").and.callThrough();
    const setItem: jasmine.Spy = spyOn(ls, "setItem").and.callThrough();
    /* tslint:disable:max-line-length quotemark */

    return sut.saveAll({ stores, items, checkouts }).then((info: Dto.AppInfo) => {
      expect(info).toBeDefined();
      expect(setItem.calls.allArgs()).toEqual([
        ['gbg-stores', '[{"id":"S0","name":"FAKE SCHNUCKS","place_id":"xxxxxxxxxxxxx","vicinity":"vicinity"},{"id":"S1","name":"Zabihah","place_id":"ChIJsUfNv0jU2IcRk9KkjfWbBC0","vicinity":"14345 Manchester Road, Ballwin"}]'],
        ['gbg-items', '[{"id":"I0","name":"asdf","needed":false},{"id":"I1","name":"zebra","needed":true},{"id":"I2","name":"another","needed":false}]'],
        ['gbg-checkouts', '[{"isoDate":"2016-04-03T04:45:38.582Z","pickups":[{"itemId":"I1","aisle":"K9"},{"itemId":"I0","aisle":"D10"}],"storeId":"S1"},{"isoDate":"2016-04-03T05:35:18.334Z","pickups":[{"itemId":"I0","aisle":"D10"}],"storeId":"S0"}]'],
      ]);
      expect(getItem).not.toHaveBeenCalled();

      expect(info.checkouts.length).toBe(2);
      expect(info.items.length).toBe(3);
      expect(info.stores.length).toBe(2);
    });
    /* tslint:enable:max-line-length quotemark */
  })));

});
