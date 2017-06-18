// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { StorePickupComponent } from './store-pickup.component';

// describe('StorePickupComponent', () => {
//   let component: StorePickupComponent;
//   let fixture: ComponentFixture<StorePickupComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ StorePickupComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(StorePickupComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should be created', () => {
//     expect(component).toBeTruthy();
//   });
// });
/* tslint:disable:object-literal-sort-keys */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { AppInfo } from '../../models/appinfo';
import { Checkout } from '../../models/checkout';
import { Item } from '../../models/item';
import { Store } from '../../models/store';

import { StorePickupComponent } from './store-pickup.component';

describe('Pickup Component', () => {
  let info: AppInfo;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FormsModule], declarations: [StorePickupComponent] });
    TestBed.overrideComponent(StorePickupComponent, { set: { template: '<div>hi</div>' } });
    info = null;
  });

  xit('should load generated stuff', () => {
    expect(info.stores.length).toBe(4);
    expect(info.checkouts.length).toBe(info.stores.length);
  });

  xit('should have aisles', () => {
    const fixture: ComponentFixture<StorePickupComponent> = TestBed.createComponent(StorePickupComponent);
    const component: StorePickupComponent = fixture.componentInstance;

    // const bobs: Store = info.stores[0];
    const ralphs: Store = info.stores[1];

    // const beer: Item = info.items[0];
    const food: Item = info.items[1];

    const now: Date = new Date();

    type Aisle = string;

    type StoreAisle = [Aisle, Item[]];

    type StoreLayout = [Store, StoreAisle];

    const layouts: StoreLayout[] = [
      [info.stores[0],
      ['s0-a1', [info.items[0], food]],
      ['a0-a2', [info.items[3]]],
      ],
      [ralphs,
        ['11a', [info.items[2], info.items[6], info.items[9]]],
        ['12a', [info.items[4], food]],
        ['11b', [info.items[3], info.items[5], info.items[7], info.items[8]]],
      ],
      [info.stores[3],
      ['s3-a1', [info.items[3], info.items[6]]],
      ],
    ];

    for (let visit = 0; visit < 20; visit++) {
      const rndLayout: StoreLayout = layouts[Math.floor(Math.random() * layouts.length)];
      const c: Checkout = new Checkout(
        rndLayout[0],
        new Date(now.valueOf() - (Math.random() * (365 * (24 * 60 * 60 * 1000)))),
      );

      c.pickups = [];
      const items: StoreAisle = rndLayout[1];
      for (let p = 0; p < 20; p++) {
        if (Math.random() < 0.2) {
          const a: Aisle = rndLayout[1][0];
          const aitems: Item[] = items[1];
          const i: Item = aitems[Math.floor(Math.random() * aitems.length)];
          // console.log(p, a, i.name);
          c.pickups.push({
            item: i,
            aisle: a,
            picked: undefined,
          });
        }
      }
      info.checkouts.push(c);
    }

    fixture.detectChanges();

    expect(component.aisles.length).toBeGreaterThan(0);

    expect(fixture.nativeElement.children[0].textContent).toContain('hi');
  });

});
