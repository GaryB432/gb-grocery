// tslint:disable:max-classes-per-file
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

import { DataIoService } from '../shared/data-io.service';
import * as Dto from '../shared/dto';
import { AboutComponent } from './about.component';

const mockDtoAppInfo: Dto.AppInfo = {
  checkouts: [
    {
      isoDate: '2016-04-03T04:45:38.582Z',
      pickups: [{ itemId: 'I1', aisle: 'K9' }, { itemId: 'I0', aisle: 'D10' }],
      storeId: 'S1',
    },
    {
      isoDate: '2016-04-03T05:35:18.334Z',
      pickups: [{ itemId: 'I0', aisle: 'S0-D10' }],
      storeId: 'S0',
    },
  ],
  items: [
    {
      id: 'I0',
      name: 'asdf',
      needed: false,
    },
    {
      id: 'I1',
      name: 'zebra',
      needed: true,
    },
    {
      id: 'I2',
      name: 'another',
      needed: false,
    },
  ],
  stores: [
    {
      id: 'S0',
      name: 'FAKE SCHNUCKS',
      place_id: 'xxxxxxxxxxxxx',
      vicinity: 'vicinity',
    },
    {
      id: 'S1',
      name: 'Atlantic Mills',
      place_id: 'ChIJsUfNv0jU2IcRk9KkjfWbBC0',
      vicinity: '14345 Manchester Road, Ballwin',
    },
  ],
};

class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy('navigate');
}

class MockDataIoService {
  public load(): Promise<Dto.AppInfo> {
    return Promise.resolve(mockDtoAppInfo);
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

describe('About Component', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
      imports: [
        FormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: DataIoService, useClass: MockDataIoService },
        { provide: Router, useClass: MockRouter },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should warn', async(() => {
    // const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('BE CAREFUL');
  }));

  it('shoud get json', async(() => {
    // fixture.detectChanges();
    fixture.whenStable().then(() => {
      // const element = fixture.nativeElement;
      expect(component.jsonInfo.length).toBe(1007); // pretty fragile but effective
    });
  }));

});
