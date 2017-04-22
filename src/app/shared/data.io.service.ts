import { Injectable } from "@angular/core";

import { LocalIoStorage } from "./data.localstorage.service";
import * as Dto from "./dto";

const ITEMS_KEY: string = "gbg-items";
const STORES_KEY: string = "gbg-stores";
const CHECKOUTS_KEY: string = "gbg-checkouts";

@Injectable()
export class DataIoService {

  constructor(private storage: LocalIoStorage) {
  }

  public clearAll(): void {
    this.storage.removeItem(CHECKOUTS_KEY);
    this.storage.removeItem(STORES_KEY);
    this.storage.removeItem(ITEMS_KEY);
  }

  public load(): Promise<Dto.AppInfo> {
    return Promise.resolve({
      checkouts: this.readCheckouts(),
      items: this.readItems(),
      stores: this.readStores(),
    });
  }

  public saveAll(newInfo: Dto.AppInfo): Promise<Dto.AppInfo> {
    this.writeStores(newInfo.stores);
    this.writeItems(newInfo.items);
    this.writeCheckouts(newInfo.checkouts);
    return Promise.resolve(newInfo);
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
