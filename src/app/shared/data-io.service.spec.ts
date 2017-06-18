import { async, inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { DataIoService } from './data-io.service';
import { DataLocalstorageService } from './data-localstorage.service';
import * as Dto from './dto';

class MockReference {
  constructor(public db: MockDb) { }

  set(arg: any) {
    return Promise.resolve(arg);
  }
  once(eventType: string) {
    return Promise.resolve({
      val: () => {
        const info = {
          items,
          stores,
          checkouts
        };
        return info;
      }
    });
  }
}

class MockDb {
  paths: string[] = [];
  ref(path?: string) {
    this.paths.push(path);
    return new MockReference(this);
  }
}

class MockAngularFireDatabase {
  public database = new MockDb();
}

const items: Dto.Item[] = [
  {
    id: 'I0',
    name: 'asdf',
    needed: false,
  },
  {
    id: 'I1',
    name: 'zebra',
    needed: true,
  },
  {
    id: 'I2',
    name: 'another',
    needed: false,
  },
];

const checkouts: Dto.Checkout[] = [
  {
    isoDate: '2016-04-03T04:45:38.582Z',
    pickups: [{ itemId: 'I1', aisle: 'K9' }, { itemId: 'I0', aisle: 'D10' }],
    storeId: 'S1',
  },
  {
    isoDate: '2016-04-03T05:35:18.334Z',
    pickups: [{ itemId: 'I0', aisle: 'D10' }],
    storeId: 'S0',
  },
];

const stores: Dto.Store[] = [
  {
    id: 'S0',
    name: 'FAKE SCHNUCKS',
    place_id: 'xxxxxxxxxxxxx',
    vicinity: 'vicinity',
  },
  {

    id: 'S1',
    name: 'Zabihah',
    place_id: 'ChIJsUfNv0jU2IcRk9KkjfWbBC0',
    vicinity: '14345 Manchester Road, Ballwin',
  },
];

class MockLocalStorage {
  private data: { [key: string]: string; } = {};
  constructor() {
    this.data['gbg-items'] = JSON.stringify(items);
    this.data['gbg-stores'] = JSON.stringify(stores);
    this.data['gbg-checkouts'] = JSON.stringify(checkouts);
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

describe('Data IO Service', () => {
  describe('auth', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: DataLocalstorageService, useClass: MockLocalStorage },
          {
            provide: AngularFireAuth, useValue: {
              authState: new Observable<Partial<firebase.User>>((sub) => {
                sub.next({ displayName: 'FUN TESTER', uid: 'uid-fun' });
                sub.complete();
              })
            }
          },
          { provide: AngularFireDatabase, useClass: MockAngularFireDatabase },
          DataIoService,
        ],
      });
    });

    it('should load', async(
      inject([
        DataIoService,
        DataLocalstorageService,
        AngularFireDatabase
      ], (sut: DataIoService, ls: MockLocalStorage, db: MockAngularFireDatabase) => {
        const getItem: jasmine.Spy = spyOn(ls, 'getItem').and.callThrough();
        const setItem: jasmine.Spy = spyOn(ls, 'setItem').and.callThrough();

        return sut.load().then((info: Dto.AppInfo) => {
          expect(info).toBeDefined();

          expect(getItem).not.toHaveBeenCalled();
          expect(setItem).not.toHaveBeenCalled();

          expect(db.database.paths).toEqual(['/users/uid-fun/appInfo']);

          expect(info.checkouts.length).toBe(2);
          expect(info.items.length).toBe(3);
          expect(info.stores.length).toBe(2);
        });
      })));

    it('should save all', async(inject([DataIoService, DataLocalstorageService], (sut: DataIoService, ls: MockLocalStorage) => {
      const getItem: jasmine.Spy = spyOn(ls, 'getItem').and.callThrough();
      const setItem: jasmine.Spy = spyOn(ls, 'setItem').and.callThrough();
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

  describe('unauth', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          { provide: DataLocalstorageService, useClass: MockLocalStorage },
          {
            provide: AngularFireAuth, useValue: {
              authState: new Observable<Partial<firebase.User>>((sub) => {
                sub.next({ uid: null });
                sub.complete();
              })
            }
          },
          { provide: AngularFireDatabase, useClass: MockAngularFireDatabase },
          DataIoService,
        ],
      });
    });
    it('should not load', async(inject([DataIoService, DataLocalstorageService], (sut: DataIoService, ls: MockLocalStorage) => {
      return sut.load()
        .then((info: Dto.AppInfo) => fail('KEEP OUT!'))
        .catch((msg) => expect(msg).toBe('unauthenticated'));
    })));

  });

});
