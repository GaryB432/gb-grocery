/* tslint:disable:no-unsafe-finally */
/* tslint:disable:max-classes-per-file */

import { Injectable } from "@angular/core";

import { ICheckout, IDtoAppInfo, IDtoStore, IItem } from "./interfaces";

const ITEMS_KEY: string = "gbg-items";
const STORES_KEY: string = "gbg-stores";
const CHECKOUTS_KEY: string = "gbg-checkouts";

@Injectable()
export class LocalIoStorage {
  public getItem(key: string): any {
    return localStorage.getItem(key);
  }
  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  public setItem(key: string, data: string): void {
    localStorage.setItem(key, data);
  }
}

@Injectable()
export class DataIoService {

  constructor(private storage: LocalIoStorage) {
  }

  public clearAll(): void {
    this.storage.removeItem(CHECKOUTS_KEY);
    this.storage.removeItem(STORES_KEY);
    this.storage.removeItem(ITEMS_KEY);
  }

  public load(): Promise<IDtoAppInfo> {
    return Promise.resolve({
      stores: this.readStores(),
      items: this.readItems(),
      checkouts: this.readCheckouts(),
    });
  }

  public saveAll(newInfo: IDtoAppInfo): Promise<IDtoAppInfo> {
    this.writeStores(newInfo.stores);
    this.writeItems(newInfo.items);
    this.writeCheckouts(newInfo.checkouts);
    return Promise.resolve(newInfo);
  }

  private readCheckouts(): ICheckout[] {
    let data: ICheckout[];
    try {
      const raw: string = this.storage.getItem(CHECKOUTS_KEY);
      data = JSON.parse(raw) || [];
    } catch (ex) {
      console.log(ex.stack);
      data = [];
    }
    finally {
      return data;
    }
  }

  private readItems(): IItem[] {
    let data: IItem[];
    try {
      const raw: string = this.storage.getItem(ITEMS_KEY);
      data = JSON.parse(raw) || [];
    } catch (ex) {
      console.log(ex.stack);
      data = [];
    }
    finally {
      return data;
    }
  }

  private readStores(): IDtoStore[] {
    let data: IDtoStore[];
    try {
      const raw: string = this.storage.getItem(STORES_KEY);
      data = JSON.parse(raw) || [];
    } catch (ex) {
      console.log(ex.stack);
      data = [];
    }
    finally {
      return data;
    }
  }

  private writeCheckouts(checkouts: ICheckout[]): void {
    this.storage.setItem(CHECKOUTS_KEY, JSON.stringify(checkouts));
  }

  private writeItems(items: IItem[]): void {
    this.storage.setItem(ITEMS_KEY, JSON.stringify(items));
  }

  private writeStores(stores: IDtoStore[]): void {
    this.storage.setItem(STORES_KEY, JSON.stringify(stores));
  }

}
