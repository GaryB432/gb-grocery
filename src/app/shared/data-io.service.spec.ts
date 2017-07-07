import { async, inject, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { DataIoService } from './data-io.service';
import { DataLocalstorageService } from './data-localstorage.service';
import * as Dto from './dto';

class MockReference {
  constructor(public db: MockDb) { }

  public set(value: any, onComplete?: (a: Error | null) => any): Promise<any> {
    if (!value) {
      throw new Error('Do not save undefined. KThx');
    }
    this.db.data = value;
    this.db.callCount++;
    return Promise.resolve(value);
  }

  public once(eventType: string) {
    return Promise.resolve({
      val: () => this.db.data,
    });
  }
}

interface MockDatabase {
  path?: string;
  data: Dto.AppInfo;
  callCount: number;
}

class MockDb implements MockDatabase {
  public path?: string;
  public data: any;
  public callCount: number;
  public ref(path?: string): MockReference {
    this.path = path;
    this.callCount = 0;
    this.data = undefined;
    return new MockReference(this);
  }
}

class MockAngularFireDatabase {
  public database = new MockDb();
}

const someAppInfo: Dto.AppInfo = {
  checkouts: [
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
  ],
  items: [
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
  ],
  stores: [
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
  ],
};

class MockLocalStorage {
  private data: { [key: string]: string | undefined; } = {};

  public setup(info: Dto.AppInfo): void {
    this.data['gbg:items:grocery-dev-3b673'] = JSON.stringify(info.items);
    this.data['gbg:stores:grocery-dev-3b673'] = JSON.stringify(info.stores);
    this.data['gbg:checkouts:grocery-dev-3b673'] = JSON.stringify(info.checkouts);
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

      jasmine.addMatchers({
        toBeProperlySet(util, customEqualityTesters): jasmine.CustomMatcher {
          return {
            compare(actual: MockDatabase, expected: MockDatabase): jasmine.CustomMatcherResult {
              const pass = util.equals(actual.path, expected.path)
                && actual.data && expected.data
                && util.equals(actual.data, expected.data)
                && util.equals(actual.data.stores, expected.data.stores)
                && util.equals(actual.data.checkouts, expected.data.checkouts)
                && util.equals(actual.data.items, expected.data.items);

              const message = actual.data
                ? util.buildFailureMessage('to be set with', false, actual, expected)
                : `${actual.path} was not set`;
              return { pass, message };
            },
          };
        },
        toHaveBeenCalled(util, customEqualityTesters): jasmine.CustomMatcher {
          return {
            compare(actual: MockDatabase, expected: never): jasmine.CustomMatcherResult {
              const pass = actual.callCount > 0;
              const message = util.buildFailureMessage('to have been called', false, actual.path);
              return { pass, message };
            },
          };
        },
      });

      TestBed.configureTestingModule({
        providers: [
          { provide: DataLocalstorageService, useClass: MockLocalStorage },
          {
            provide: AngularFireAuth, useValue: {
              authState: new Observable<Partial<firebase.User>>((sub) => {
                sub.next({ displayName: 'FUN TESTER', uid: 'uid-fun' });
                sub.complete();
              }),
            },
          },
          { provide: AngularFireDatabase, useClass: MockAngularFireDatabase },
          DataIoService,
        ],
      });
    });

    it('should load from localstorage with no cloud data', async(
      inject([
        DataIoService,
        DataLocalstorageService,
        AngularFireDatabase,
      ], (sut: DataIoService, ls: MockLocalStorage, db: MockAngularFireDatabase) => {
        const setItem: jasmine.Spy = spyOn(ls, 'setItem').and.callThrough();

        ls.setup({ ...someAppInfo, items: [] });
        db.database.data = undefined;

        expect(db.database.data).toBeUndefined();

        return sut.load().then((info: Dto.AppInfo) => {
          expect(info).toBeDefined();

          expect(setItem).not.toHaveBeenCalled();

          (expect(db.database) as any).not.toHaveBeenCalled({ path: '/users/uid-fun/appInfo' });

          expect(info.checkouts.length).toBe(2);
          expect(info.items.length).toBe(0);
          expect(info.stores.length).toBe(2);
        });
      })));

    it('should load some cloud data', async(
      inject([
        DataIoService,
        DataLocalstorageService,
        AngularFireDatabase,
      ], (sut: DataIoService, ls: MockLocalStorage, db: MockAngularFireDatabase) => {
        const setItem: jasmine.Spy = spyOn(ls, 'setItem').and.callThrough();

        ls.setup({
          checkouts: [],
          items: [],
          stores: [],
        });

        db.database.data = { ...someAppInfo };

        expect(db.database.data).toBeDefined();

        return sut.load().then((info: Dto.AppInfo) => {
          expect(info).toBeDefined();

          expect(setItem).not.toHaveBeenCalled();

          (expect(db.database) as any).toBeProperlySet({ path: '/users/uid-fun/appInfo', data: someAppInfo });

          expect(info.checkouts.length).toBe(2);
          expect(info.items.length).toBe(3);
          expect(info.stores.length).toBe(2);
        });
      })));

    it('should save all',
      async(inject([
        DataIoService,
        DataLocalstorageService,
      ],
        (sut: DataIoService, ls: MockLocalStorage) => {
          const getItem: jasmine.Spy = spyOn(ls, 'getItem').and.callThrough();
          const setItem: jasmine.Spy = spyOn(ls, 'setItem').and.callThrough();
          /* tslint:disable:max-line-length quotemark */

          return sut.saveAll(someAppInfo).then((info: Dto.AppInfo) => {
            expect(info).toBeDefined();
            expect(setItem.calls.allArgs()).toEqual([
              ['gbg:stores:grocery-dev-3b673', '[{"id":"S0","name":"FAKE SCHNUCKS","place_id":"xxxxxxxxxxxxx","vicinity":"vicinity"},{"id":"S1","name":"Zabihah","place_id":"ChIJsUfNv0jU2IcRk9KkjfWbBC0","vicinity":"14345 Manchester Road, Ballwin"}]'],
              ['gbg:items:grocery-dev-3b673', '[{"id":"I0","name":"asdf","needed":false},{"id":"I1","name":"zebra","needed":true},{"id":"I2","name":"another","needed":false}]'],
              ['gbg:checkouts:grocery-dev-3b673', '[{"isoDate":"2016-04-03T04:45:38.582Z","pickups":[{"itemId":"I1","aisle":"K9"},{"itemId":"I0","aisle":"D10"}],"storeId":"S1"},{"isoDate":"2016-04-03T05:35:18.334Z","pickups":[{"itemId":"I0","aisle":"D10"}],"storeId":"S0"}]'],
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
              authState: new Observable<Partial<firebase.User> | null>((sub) => {
                sub.next(null);
                sub.complete();
              }),
            },
          },
          { provide: AngularFireDatabase, useClass: MockAngularFireDatabase },
          DataIoService,
        ],
      });
    });
    it('should not load',
      async(inject([
        DataIoService,
        DataLocalstorageService,
      ], (sut: DataIoService, ls: MockLocalStorage) => {
        return sut.load()
          .then((info: Dto.AppInfo) => fail('KEEP OUT!'))
          .catch((msg) => expect(msg).toBe('unauthenticated'));
      })));

  });

});
