import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import type { AppInfo } from '../models/appinfo';
import { DataService } from '../shared/data/data.service';
import { AbstractGeoService } from '../shared/geo/abstract-geo.service';
import { MockGeoService } from '../shared/geo/mock-geo.service';
import { LogicService } from '../shared/logic.service';
import { StoreComponent } from './store.component';

class MockDataService {
  public load(): Promise<AppInfo> {
    const info: AppInfo = {
      checkouts: [],
      items: [],
      stores: [],
    };
    return Promise.resolve(info);
  }
}

class MockToastrService {}

class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy('navigate');
}

describe('StoreComponent', () => {
  beforeEach(
    waitForwaitForAsync(() => {
      void void TestBed.overrideComponent(StoreComponent, {
        set: {
          template: '<h1>Overridden template something here</h1>',
        },
      })
        .configureTestingModule({
          declarations: [StoreComponent],
          imports: [RouterTestingModule],
          providers: [
            { provide: LogicService, useClass: LogicService },
            { provide: AbstractGeoService, useClass: MockGeoService },
            { provide: DataService, useClass: MockDataService },
            { provide: ToastrService, useClass: MockToastrService },
            { provide: Router, useClass: MockRouter },
          ],
        })
        .compileComponents();
    })
  );

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(StoreComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  xit('should render title in a h1 tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(StoreComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('something');
  }));
});
