import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ItemComponent } from './item.component';
import { LogicService } from '../shared/logic.service';
import { Item } from '../models/item';
import { AppInfo } from '../models/appinfo';
import { Checkout } from '../models/checkout';
import { Store } from '../models/store';

import { By } from '@angular/platform-browser';
import { Location, CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

class MockLogicService {
  private appInfo: AppInfo = {
    items: [],
    stores: [],
    checkouts: []
  };

  public load(): Promise<AppInfo> {
    this.appInfo.stores = [];
    return Promise.resolve(this.appInfo);
  }
  public getItem(id: string): Promise<Item> {
    return Promise.resolve({ id, checkouts: [] });
  }
}

@Component({
  template: ''
})
class DummyComponent {
}
describe('ItemComponent', () => {
  let component: ItemComponent;
  let fixture: ComponentFixture<ItemComponent>;

  beforeEach(async(() => {
    TestBed.overrideComponent(ItemComponent, {
      set: {
        template: '<div>Overridden template here</div>',
      },
    });
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([
        { path: 'home', component: DummyComponent }
      ])],
      declarations: [ItemComponent, DummyComponent],
      providers: [
        { provide: LogicService, useClass: MockLogicService },
        // { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        // { provide: DataService, useClass: MockDataService },
        // { provide: Router, useClass: MockRouter },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
