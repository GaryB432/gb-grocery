import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { AppInfo } from '../models/appinfo';
import { Checkout } from '../models/checkout';
import { Item } from '../models/item';
import { Pickup } from '../models/pickup';
import { Store } from '../models/store';
import { DataService } from './data.service';
import { Place } from './geo/place';
import { LogicService } from './logic.service';

class MockDataService {
  private info: AppInfo = {
    checkouts: [],
    items: [],
    stores: [],
  };
  public load(): Promise<AppInfo> {
    const today: Date = new Date(2001, 2, 3, 4, 5, 6, 7);
    this.info.stores = [0, 1].map(n => {
      const s: Store = new Store(`S${n}`, `STORE ${n}`);
      s.placeId = `PLACE${n}`;
      s.checkouts = [];
      return s;
    });
    this.info.items = [0, 1, 2].map(n => {
      const item: Item = new Item();
      item.id = `I-${n}`;
      item.name = `ITEM ${n}`;
      return item;
    });
    this.info.checkouts = [
      new Checkout(
        this.info.stores[1],
        new Date(today.getTime() - 3 * 3660 * 1000 * 24)
      ),
      new Checkout(
        this.info.stores[0],
        new Date(today.getTime() - 2 * 3660 * 1000 * 24)
      ),
    ];

    this.info.checkouts[0].pickups = [new Pickup(this.info.items[1], 'S1-A1')];
    this.info.checkouts[1].pickups = [
      new Pickup(this.info.items[0], 'S0-A0'),
      new Pickup(this.info.items[2], 'S0-A2'),
    ];

    return Promise.resolve(this.info);
  }

  public saveAll(_info: AppInfo): Promise<AppInfo> {
    return Promise.resolve(this.info);
  }

  public clearAll(): void {
    this.info = {
      checkouts: [],
      items: [],
      stores: [],
    };
  }
}

describe('Logic Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LogicService, useClass: LogicService },
        { provide: DataService, useClass: MockDataService },
      ],
    });
  });

  it(
    'should load',
    inject(
      [LogicService, DataService],
      fakeAsync((sut: LogicService, _ds: DataService) => {
        // console.log(ds, 'is not used');
        let info: AppInfo = { items: [], stores: [], checkouts: [] };
        sut.load().then((response: AppInfo) => {
          info = response;
        });
        tick();
        expect(info).toBeDefined();
        expect(info.stores.length).toBe(2);
        expect(info.items.length).toBe(3);
        expect(info.checkouts.length).toBe(2);
        expect(info.checkouts[0].store).toBe(info.stores[1]);

        expect(info.checkouts[0].pickups.length).toBe(1);
        expect(info.checkouts[0].pickups[0].item).toBe(info.items[1]);
        expect(info.checkouts[0].pickups[0].aisle).toBe('S1-A1');

        expect(info.checkouts[0].pickups.map(p => p.item)).toEqual([
          info.items[1],
        ]);
      })
    )
  );

  it(
    'should create item',
    inject(
      [LogicService, DataService],
      fakeAsync((sut: LogicService, _ds: DataService) => {
        let info: AppInfo;
        sut.load().then((response: AppInfo) => {
          info = response;
          expect(info.items.length).toBe(3);
        });
        tick();
        sut.insertItem('tester').then(item => {
          expect(item.id).not.toBeUndefined();
          expect(info.items.find(i => i.id === item.id)).toBeDefined();
          expect(item.name).toBe('tester');
          expect(item.needed).toBe(true);
          expect(info.items.length).toBe(4);
        });
      })
    )
  );

  describe('Places and Stores', () => {
    const expected: Partial<Store> = new Store(undefined, 'name');

    Object.assign(expected, {
      checkouts: [],
      formattedAddress: 'address',
      formattedPhoneNumber: 'phone',
      icon: 'icon',
      location: {
        accuracy: 0,
        altitude: 0,
        altitudeAccuracy: 0,
        heading: 0,
        latitude: 3,
        longitude: 5,
        speed: 0,
      },
      photo: 'photo',
      types: ['fake'],
      url: 'url',
      vicinity: 'vicinity',
      website: 'website',
    });

    const somePlace: Partial<Place> = {
      formattedAddress: 'address',
      formattedPhoneNumber: 'phone',
      icon: 'icon',
      location: { latitude: 3, longitude: 5 },
      name: 'name',
      photo: 'photo',
      types: ['fake'],
      url: 'url',
      vicinity: 'vicinity',
      website: 'website',
    };

    it(
      'should get stores from nearby places',
      inject(
        [LogicService, DataService],
        fakeAsync((sut: LogicService, _ds: DataService) => {
          let info: AppInfo = {
            checkouts: [],
            items: [],
            stores: [],
          };
          sut.load().then((response: AppInfo) => {
            info = response;
            expect(info.items.length).toBe(3);
          });
          tick();
          somePlace.placeId = 'NEW PLACE';
          const ss = sut.getStoresFromNearbyPlaces([somePlace as Place]);
          expect(ss[0].placeId).toEqual('NEW PLACE');
        })
      )
    );
    it(
      'should get stores from nearby places w/place',
      inject(
        [LogicService, DataService],
        fakeAsync((sut: LogicService, _ds: DataService) => {
          let info: AppInfo = {
            checkouts: [],
            items: [],
            stores: [],
          };
          sut.load().then((response: AppInfo) => {
            info = response;
            expect(info.items.length).toBe(3);
          });
          tick();
          somePlace.placeId = info.stores[0].placeId;
          const ss = sut.getStoresFromNearbyPlaces([somePlace as Place]);

          expect(ss).toEqual([info.stores[0]]);
        })
      )
    );
  });

  it(
    'should clear all',
    inject(
      [LogicService, DataService],
      fakeAsync((sut: LogicService, ds: DataService) => {
        spyOn(ds, 'clearAll');
        sut.clearAll();
        expect(ds.clearAll).toHaveBeenCalled();
      })
    )
  );
});

describe('More Logic Service', () => {
  const info: AppInfo = new AppInfo();

  info.stores = [0, 1, 2, 3].map(n => {
    return new Store(`S${n}`, `STORE ${n}`);
  });

  info.items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
    const item: Item = {
      checkouts: [],
      id: `I${n}`,
      name: `ITEM ${n}`,
      needed: false,
    };
    return item;
  });

  it('should get store aisles', () => {
    const bobs: Store = info.stores[0];
    const ralphs: Store = info.stores[1];

    info.checkouts = [
      {
        date: new Date(2001, 0, 2, 3, 4, 5, 6),
        distance: 0,
        pickups: [
          { item: info.items[0], aisle: '11c', picked: false },
          { item: info.items[2], aisle: '11a', picked: false },
        ],
        store: ralphs,
      },
      {
        date: new Date(2001, 0, 2, 4, 4, 5, 6),
        distance: 0,
        pickups: [
          { item: info.items[0], aisle: '765n', picked: false },
          { item: info.items[2], aisle: '926m', picked: false },
        ],
        store: bobs,
      },
      {
        date: new Date(2001, 0, 3, 3, 4, 5, 6),
        distance: 0,
        pickups: [
          { item: info.items[0], aisle: '11b', picked: false },
          { item: info.items[1], aisle: '11b', picked: false },
          { item: info.items[2], aisle: undefined, picked: false },
          { item: info.items[3], aisle: '11b', picked: false },
          { item: info.items[4], aisle: '11a', picked: false },
        ],
        store: ralphs,
      },
      {
        date: new Date(2001, 0, 2, 6, 4, 5, 6),
        distance: 0,
        pickups: [
          { item: info.items[0], aisle: '65n', picked: false },
          { item: info.items[1], aisle: '26m', picked: false },
          { item: info.items[2], aisle: '26m', picked: false },
        ],
        store: bobs,
      },
      {
        date: new Date(2001, 0, 2, 5, 4, 5, 6),
        distance: 0,
        pickups: [
          { item: info.items[0], aisle: '11c', picked: false },
          { item: info.items[0], aisle: '11b', picked: false },
          { item: info.items[2], aisle: '11a', picked: false },
        ],
        store: ralphs,
      },
    ];

    LogicService.project(info);

    expect(LogicService.getStoreAisles(ralphs)).toEqual(['11a', '11b', '11c']);
  });

  it('should sort aisles', () => {
    expect(
      LogicService.sortAisles([
        'B',
        '10B',
        '2A',
        'A7',
        '10A',
        'A',
        '10',
        'A8',
        '2',
        '1',
        '2B',
        '1A',
      ])
    ).toEqual([
      '1',
      '1A',
      '2',
      '2A',
      '2B',
      '10',
      '10A',
      '10B',
      'A',
      'A7',
      'A8',
      'B',
    ]);
  });

  it('should sort empty aisles', () => {
    expect(LogicService.sortAisles([])).toEqual([]);
  });

  it('should sort pickups', () => {
    interface PickupStarter {
      name: string;
      aisle: string;
    }

    const setup: PickupStarter[] = [
      { name: 'A', aisle: 'B' },
      { name: 'C', aisle: 'Z' },
      { name: 'G', aisle: 'A' },
      { name: 'B', aisle: 'C' },
      { name: 'E', aisle: 'Z' },
      { name: 'F', aisle: 'A' },
      { name: 'D', aisle: 'Z' },
    ];

    const pickups: Pickup[] = setup.map(p => {
      const item: Item = new Item();
      item.id = `ID${p.name}`;
      item.name = p.name;
      return new Pickup(item, p.aisle);
    });

    expect(LogicService.sortPickups(pickups).map(p => p.item.name)).toEqual([
      'F',
      'G',
      'A',
      'B',
      'C',
      'D',
      'E',
    ]);
  });

  it('should predict aisle properly', () => {
    const store: Store = new Store('S', 'STORE S');

    const item: Item = new Item();
    item.id = 'I0';
    item.checkouts = [
      new Checkout(store, new Date(2001, 2, 3, 4, 5, 6)),
      new Checkout(store, new Date(2001, 2, 2, 4, 5, 6)),
    ];
    item.checkouts[0].pickups = [new Pickup(item, '2-3')];
    item.checkouts[1].pickups = [new Pickup(item, '2-2')];

    expect(LogicService.predictAisle(item, store)).toBe('2-3');
  });

  it('should predict undefined aisle properly', () => {
    const store: Store = new Store('S', 'STORE S');

    const item: Item = new Item();

    expect(LogicService.predictAisle(item, store)).toBeUndefined();
  });
});
