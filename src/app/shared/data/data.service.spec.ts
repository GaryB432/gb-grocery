import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { AppInfo } from '../../models/appinfo';
import { Utilities } from '../../shared/utilities';
import { DataIOService } from './data-io.service';
import { DataService } from './data.service';
import * as Dto from './dto';

const items: Dto.Item[] = [
  {
    favorite: false,
    id: 'I0',
    name: 'asdf',
    needed: false,
  },
  {
    favorite: false,
    id: 'I1',
    name: 'zebra',
    needed: true,
  },
  {
    favorite: false,
    id: 'I2',
    name: 'another',
    needed: false,
  },
];

const checkouts: Dto.Checkout[] = [
  {
    isoDate: '2016-04-03T04:45:38.582Z',
    pickups: [
      { itemId: 'I1', aisle: undefined },
      { itemId: 'I0', aisle: 'D10' },
    ],
    storeId: 'S1',
  },
  {
    isoDate: '2016-04-03T05:35:18.334Z',
    pickups: [{ itemId: 'I0', aisle: 'S0-D10' }],
    storeId: 'S0',
  },
];

const stores: Dto.Store[] = [
  {
    // 'formatted_address': 'formatted_address',
    // 'formatted_phone_number': 'formatted_phone_number',
    // 'icon': 'http://maps.gstatic.com/mapfiles/place_api/icons/generic_business-71.png',
    // 'location': {
    //     'altitudeAccuracy': 0,
    //     'longitude': 301,
    //     'latitude': 300,
    //     'speed': 0,
    //     'heading': 0,
    //     'altitude': 0,
    //     'accuracy': 0
    // },
    // 'types': ['grocery_or_supermarket'],
    // 'url': 'url',
    // 'website': 'website',
    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
    id: 'S0',
    name: 'FAKE SCHNUCKS',
    place_id: 'xxxxxxxxxxxxx',
    vicinity: 'vicinity',
  },
  {
    icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
    id: 'S1',
    name: 'Atlantic Mills',
    place_id: 'ChIJsUfNv0jU2IcRk9KkjfWbBC0',
    vicinity: '14345 Manchester Road, Ballwin',
  },
];

class MockDataIoService {
  public load(): Promise<Dto.AppInfo> {
    return Promise.resolve({ stores, items, checkouts });
  }
}

describe('Data Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DataService, useClass: DataService, deps: [DataIOService] },
        { provide: DataIOService, useClass: MockDataIoService },
      ],
    });
  });

  it('should load', () =>
    inject(
      [DataService, DataIOService],
      fakeAsync((sut: DataService) => {
        const info: AppInfo = {
          checkouts: [],
          items: [],
          stores: [],
        };
        void sut.load().then((response: AppInfo) => {
          Object.assign(info, response);
        });
        tick();
        expect(info).toBeDefined();
        expect(info.stores.length).toBe(2);
        expect(info.items.length).toBe(3);
        expect(info.checkouts.length).toBe(2);

        expect(
          Utilities.flatten(
            info.checkouts.map((c) => c.pickups.map((p) => p.aisle))
          )
        ).toEqual([undefined, 'D10', 'S0-D10']);

        expect(info.checkouts[0].store).toBe(info.stores[1]);
        expect(info.checkouts[0].pickups.map((p) => p.item)).toEqual([
          info.items[1],
          info.items[0],
        ]);
        expect(info.checkouts[0].pickups.length).toEqual(2);

        expect(info.items[0].checkouts).toBeDefined();
        expect(info.items[0].checkouts.length).toBe(0);
      })
    ));

  it('should throw on bad store', () =>
    inject(
      [DataService, DataIOService],
      fakeAsync((sut: DataService) => {
        checkouts[0].storeId = 'WTF';
        expect(stores.find((s) => s.id === checkouts[0].storeId)).toBeUndefined(
          'you have a weird store id'
        );
        sut
          .load()
          .then((_response: AppInfo) => {
            fail('keep out');
          })
          .catch((e: Error) => {
            expect(e.message).toEqual('no store');
          });
        tick();
      })
    ));
});
