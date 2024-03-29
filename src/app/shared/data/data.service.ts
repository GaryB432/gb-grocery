import { Injectable } from '@angular/core';

import { AppInfo } from '../../models/appinfo';
import { Utilities } from '../utilities';
import { DataIOService } from './data-io.service';
import * as Dto from './dto';

@Injectable({ providedIn: 'root' })
export class DataService {
  public constructor(private io: DataIOService) {}

  public clearAll(): void {
    this.io.clearAll();
  }

  public async load(): Promise<AppInfo> {
    const info: Partial<AppInfo> = {};

    const a = await this.io.load();
    info.stores = a.stores.map((s) => Utilities.dtoToStore(s));
    info.items = a.items.map((i) => Utilities.dtoToItem(i));
    info.checkouts = a.checkouts.map((c) =>
      Utilities.dtoToCheckout(c, info as AppInfo)
    );
    return info as AppInfo;
  }

  public async saveAll(info: AppInfo): Promise<AppInfo> {
    const dto: Dto.AppInfo = {
      checkouts: info.checkouts.map((c) => {
        return {
          distance: c.distance || -1,
          isoDate: c.date.toISOString(),
          pickups: c.pickups.map((p) => {
            return {
              aisle: p.aisle,
              itemId: p.item.id,
            };
          }),
          storeId: c.store.id as string,
        };
      }),
      items: info.items.map((i) => {
        return {
          favorite: i.favorite,
          id: i.id,
          name: i.name,
          needed: i.needed,
        };
      }),
      stores: info.stores.map((s) => {
        return {
          icon: s.icon || '',
          id: s.id || '',
          name: s.name,
          place_id: s.placeId,
          vicinity: s.vicinity || '',
        };
      }),
    };

    for (const c of dto.checkouts) {
      for (const p of c.pickups) {
        if (!p.aisle) {
          delete p.aisle;
        }
      }
    }

    await this.io.saveAll(dto);
    return info;
  }
}
