import {ComponentFixture, TestBed } from '@angular/core/testing';
import { AppInfo } from 'src/app/models/appinfo';
import { LogicService } from 'src/app/shared/logic.service';

import { Checkout } from '../../models/checkout';
import { Item } from '../../models/item';
import { Store } from '../../models/store';
import { HomeItemComponent } from './home-item.component';

class MockLogicService {
  private appInfo: AppInfo = {
    checkouts: [],
    items: [],
    stores: [],
  };

  public load(): Promise<AppInfo> {
    this.appInfo.stores = [];
    return Promise.resolve(this.appInfo);
  }
  public getItem(id: string): Promise<Item> {
    return Promise.resolve({
      checkouts: [],
      favorite: false,
      id,
      name: `YOUR ITEM ${id}`,
      needed: false,
    });
  }
}

describe('HomeItemComponent', () => {
  let component: HomeItemComponent;
  let fixture: ComponentFixture<HomeItemComponent>;

  beforeEach(async() => {
    void TestBed.configureTestingModule({
      declarations: [HomeItemComponent],
      providers: [
        { provide: LogicService, useClass: MockLogicService },
        // { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        // { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        // { provide: DataService, useClass: MockDataService },
        // { provide: Router, useClass: MockRouter },
      ],
    });
    void TestBed.overrideComponent(HomeItemComponent, {
      set: { template: '<div>hi</div>' },
    });
    void TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeItemComponent);
    component = fixture.componentInstance;
    component.item = new Item();

    const stores: Store[] = [0, 1, 2, 3, 43].map(
      (n) => new Store(`S${n}`, `Store ${n}`)
    );

    component.item.checkouts = [
      new Checkout(stores[1], new Date('2016-04-16T07:55:26.754Z')),
      new Checkout(stores[2], new Date('2016-03-16T07:55:26.754Z')),
      new Checkout(stores[0], new Date('2016-07-16T07:55:26.754Z')),
      new Checkout(stores[3], new Date('2016-06-16T07:55:26.754Z')),
    ];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get recent checkout', () => {
    expect(component.recentCheckout).not.toBeNull();
    const rco = component.recentCheckout;
    if (rco) {
      expect(rco.store.id).toBe('S0');
    } else {
      fail('recent checkout is null');
    }
  });
});
