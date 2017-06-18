import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

import { DataLocalstorageService } from './data-localstorage.service';
import * as Dto from './dto';

const ITEMS_KEY = 'gbg-items';
const STORES_KEY = 'gbg-stores';
const CHECKOUTS_KEY = 'gbg-checkouts';

@Injectable()
export class DataIoService {
  private uid: string;

  private infoRef: firebase.database.Reference;

  public get isAuthenticated(): boolean {
    return !!this.uid;
  }

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storage: DataLocalstorageService) {

    afAuth.authState.subscribe((user: firebase.User) => {
      if (user) {
        this.uid = user.uid;
        this.infoRef = this.db.database.ref(`/users/${this.uid}/appInfo`);
      }
    });
  }

  public clearAll(): void {
    this.storage.removeItem(CHECKOUTS_KEY);
    this.storage.removeItem(STORES_KEY);
    this.storage.removeItem(ITEMS_KEY);
    this.infoRef.set(null);
  }

  public load(): Promise<Dto.AppInfo> {
    return new Promise<Dto.AppInfo>((resolve, reject) => {

      if (this.isAuthenticated) {
        let info: Dto.AppInfo = {
          items: [],
          checkouts: [],
          stores: []
        };
        this.infoRef
          .once('value')
          .then((snapshot: { val: () => Dto.AppInfo }) => {
            const dbInfo = snapshot.val();
            if (dbInfo) {
              Object.assign(info, dbInfo);
            } else {
              console.warn('no data');
              info = {
                checkouts: this.readCheckouts(),
                items: this.readItems(),
                stores: this.readStores(),
              };
              this.infoRef.set(info);
            }
            resolve(info);
          });

      } else {
        reject('unauthenticated');
      }

    });
  }

  public saveAll(newInfo: Dto.AppInfo): Promise<Dto.AppInfo> {
    this.writeStores(newInfo.stores);
    this.writeItems(newInfo.items);
    this.writeCheckouts(newInfo.checkouts);

    return new Promise<Dto.AppInfo>((resolve, reject) => {

      if (this.isAuthenticated) {
        this.infoRef.set(newInfo)
          .then(() => resolve(newInfo))
          .catch((reason) => reject(reason));
      } else {
        reject('unauthenticated');
      }

    });
  }

  private readCheckouts(): Dto.Checkout[] {
    let data: Dto.Checkout[];
    try {
      const raw: string = this.storage.getItem(CHECKOUTS_KEY);
      data = JSON.parse(raw) || [];
    } catch (ex) {
      // console.log(ex.stack);
      data = [];
    }
    return data;
  }

  private readItems(): Dto.Item[] {
    let data: Dto.Item[];
    try {
      const raw: string = this.storage.getItem(ITEMS_KEY);
      data = JSON.parse(raw) || [];
    } catch (ex) {
      // console.log(ex.stack);
      data = [];
    }
    return data;
  }

  private readStores(): Dto.Store[] {
    let data: Dto.Store[];
    try {
      const raw: string = this.storage.getItem(STORES_KEY);
      data = JSON.parse(raw) || [];
    } catch (ex) {
      // console.log(ex.stack);
      data = [];
    }
    return data;
  }

  private writeCheckouts(checkouts: Dto.Checkout[]): void {
    this.storage.setItem(CHECKOUTS_KEY, JSON.stringify(checkouts));
  }

  private writeItems(items: Dto.Item[]): void {
    this.storage.setItem(ITEMS_KEY, JSON.stringify(items));
  }

  private writeStores(stores: Dto.Store[]): void {
    this.storage.setItem(STORES_KEY, JSON.stringify(stores));
  }

}
