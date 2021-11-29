// tslint:disable:max-classes-per-file
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { AppInfo } from '../models/appinfo';
import { Item } from '../models/item';
import { LogicService } from '../shared/logic.service';
import { ItemComponent } from './item.component';

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
      id,
      name: `YOUR ITEM ${id}`,
      needed: false,
    });
  }
}

class AngularFireAuthMock {
  // public login() { }
  // public logout() { }
  public authState = new Observable<Partial<firebase.User>>((sub) => {
    sub.next({ displayName: 'FUN TESTER' });
    sub.complete();
  });
}

@Component({
  template: '',
})
class DummyComponent {}
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
      declarations: [ItemComponent, DummyComponent],
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: LogicService, useClass: MockLogicService },
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        // { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        // { provide: DataService, useClass: MockDataService },
        // { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
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
