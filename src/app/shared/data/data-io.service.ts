import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { environment } from '../../../environments/environment';
import { DataLocalStorageService } from './data-local-storage.service';

import * as Dto from './dto';

const ITEMS_KEY = `gbg:items:${environment.firebase.projectId}`;
const STORES_KEY = `gbg:stores:${environment.firebase.projectId}`;
const CHECKOUTS_KEY = `gbg:checkouts:${environment.firebase.projectId}`;

@Injectable({
  providedIn: 'root',
})
export class DataIOService {
  // private uid: string;
  private user: firebase.UserInfo | null = null;

  private infoRef?: firebase.database.Reference;

  public get isAuthenticated(): boolean {
    return !!this.user;
  }

  constructor(
    afAuth: AngularFireAuth,
    db: AngularFireDatabase,
    private storage: DataLocalStorageService
  ) {
    afAuth.authState.subscribe((user: firebase.User | null) => {
      this.user = user;
      if (!!user) {
        this.infoRef = db.database.ref(`/users/${user.uid}/appInfo`);
      }
    });
  }

  public clearAll(): void {
    this.storage.removeItem(CHECKOUTS_KEY);
    this.storage.removeItem(STORES_KEY);
    this.storage.removeItem(ITEMS_KEY);
    if (!this.infoRef) {
      throw new Error('no inforef');
    }
    this.infoRef.set(null);
  }

  public load(): Promise<Dto.AppInfo> {
    return new Promise<Dto.AppInfo>((resolve, reject) => {
      if (this.isAuthenticated) {
        const info: Dto.AppInfo = {
          checkouts: [],
          items: [],
          stores: [],
        };
        this.infoRef!.once('value').then(
          (snapshot: { val: () => Dto.AppInfo }) => {
            const dbInfo = snapshot.val();
            const lsinfo: Dto.AppInfo = {
              checkouts: this.readCheckouts(),
              items: this.readItems(),
              stores: this.readStores(),
            };
            if (dbInfo) {
              if (dbInfo.stores) {
                dbInfo.stores
                  .filter(s => !s.icon)
                  .forEach(s => (s.icon = 'https://via.placeholder.com/71x71'));
              }
              Object.assign(info, dbInfo);
            } else {
              // no cloud data. initializing from local-storage
              Object.assign(info, lsinfo);
              if (info.items.length > 0) {
                this.infoRef!.set(info);
              }
            }
            resolve(info);
          }
        );
      } else {
        reject('unauthenticated');
      }
    });
  }

  public saveAll(newInfo: Dto.AppInfo): Promise<Dto.AppInfo> {
    this.writeStores(newInfo.stores);
    this.writeItems(newInfo.items);
    this.writeCheckouts(newInfo.checkouts);

    console.log('saveAll', newInfo);

    return new Promise<Dto.AppInfo>((resolve, reject) => {
      if (this.isAuthenticated) {
        this.infoRef!.set(newInfo)
          .then(() => resolve(newInfo))
          .catch(reason => reject(reason));
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
