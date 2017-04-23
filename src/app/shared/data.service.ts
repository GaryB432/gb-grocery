import { Injectable } from "@angular/core";

import { DataIoService } from "../shared/data.io.service";
import * as Dto from "./dto";
import { AppInfo } from "./models/appinfo";
import { Utilities } from "./utilities";

@Injectable()
export class DataService {

  constructor(private io: DataIoService) {
  }

  public clearAll(): void {
    this.io.clearAll();
  }

  public load(): Promise<AppInfo> {
    const info: AppInfo = {
      checkouts: undefined,
      items: undefined,
      stores: undefined,
    };

    return this.io.load().then((a) => {
      info.stores = a.stores.map((s) => Utilities.dtoToStore(s));
      info.items = a.items.map((i) => Utilities.dtoToItem(i));
      info.checkouts = a.checkouts.map((c) => Utilities.dtoToCheckout(c, info));
      return info;
    });
  }

  public saveAll(info: AppInfo): Promise<AppInfo> {
    const dto: Dto.AppInfo = {
      checkouts: info.checkouts.map((c) => {
        return {
          isoDate: c.date.toISOString(),
          pickups: c.pickups.map((p) => {
            return {
              aisle: p.aisle,
              itemId: p.item.id,
            };
          }),
          storeId: c.store.id,
        };
      }),
      items: info.items.map((i) => {
        return {
          id: i.id,
          name: i.name,
          needed: i.needed,
        };
      }),
      stores: info.stores.map((s) => {
        return {
          id: s.id,
          name: s.name,
          place_id: s.placeId,
          vicinity: s.vicinity,
        };
      }),
    };

    return this.io.saveAll(dto).then(() => info);
  }

}
