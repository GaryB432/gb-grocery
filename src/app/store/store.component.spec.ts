import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppInfo } from '../models/appinfo';
import { DataService } from '../shared/data.service';
import { LogicService } from '../shared/logic.service';
import { AbstractGeoCoder, LocalGeoCoder } from './geocoding.service';
import { StoreComponent } from './store.component';

class MockDataService {
  public load(): Promise<AppInfo> {
    const info: AppInfo = {
      items: [],
      stores: [],
      checkouts: []
    };
    return Promise.resolve(info);
  }
}

class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy('navigate');
}

describe('StoreComponent', () => {
  beforeEach(async(() => {
    TestBed.overrideComponent(StoreComponent, {
      set: {
        template: '<h1>Overridden template something here</h1>',
      },
    }).configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        StoreComponent
      ],
      providers: [
        { provide: LogicService, useClass: LogicService },
        { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(StoreComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  xit('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(StoreComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('something');
  }));
});
