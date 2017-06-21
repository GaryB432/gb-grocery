import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeItemComponent } from './home-item.component';
import { SharedModule } from '../../shared/shared.module';
import { Checkout } from '../../models/checkout';
import { Store } from '../../models/store';
import { Item } from '../../models/item';

describe('HomeItemComponent', () => {
  let component: HomeItemComponent;
  let fixture: ComponentFixture<HomeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [HomeItemComponent]
    });
    TestBed.overrideComponent(HomeItemComponent, { set: { template: '<div>hi</div>' } });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeItemComponent);
    component = fixture.componentInstance;
    component.item = new Item();

    const stores: Store[] = [0, 1, 2, 3, 4].map((n) => new Store(`S${n}`, `Store ${n}`));

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
    expect(component.recentCheckout.store.id).toBe('S0');
  });
});