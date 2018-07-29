// tslint:disable:max-classes-per-file
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
// import { AngularFireAuth } from 'angularfire2/auth';
// import * as firebase from 'firebase/app';
// import { Observable } from 'rxjs';

import { AppInfo } from '../models/appinfo';
import { Item } from '../models/item';
import { LogicService } from '../shared/logic.service';
import { CheckoutComponent } from './checkout.component';

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

// class AngularFireAuthMock {
//   // public login() { }
//   // public logout() { }
//   public authState = new Observable<Partial<firebase.User>>(sub => {
//     sub.next({ displayName: 'FUN TESTER' });
//     sub.complete();
//   });
// }

@Component({
  template: '',
})
class DummyComponent {}
xdescribe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async(() => {
    TestBed.overrideComponent(CheckoutComponent, {
      set: {
        template: '<div>Overridden template here</div>',
      },
    });
    TestBed.configureTestingModule({
      declarations: [CheckoutComponent, DummyComponent],
      imports: [
        CommonModule,
        FormsModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyComponent },
        ]),
      ],
      providers: [
        { provide: LogicService, useClass: MockLogicService },
        // { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        // { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        // { provide: DataService, useClass: MockDataService },
        // { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
