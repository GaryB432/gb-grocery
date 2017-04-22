/* tslint:disable:max-classes-per-file */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { DataIoService } from "../shared/data.io.service";
import * as Dto from "../shared/dto";
import { AboutComponent } from "./about.component";

const mockDtoAppInfo: Dto.AppInfo = {
  checkouts: [
    {
      isoDate: "2016-04-03T04:45:38.582Z",
      pickups: [{ itemId: "I1", aisle: "K9" }, { itemId: "I0", aisle: "D10" }],
      storeId: "S1",
    },
    {
      isoDate: "2016-04-03T05:35:18.334Z",
      pickups: [{ itemId: "I0", aisle: "S0-D10" }],
      storeId: "S0",
    },
  ],
  items: [
    {
      id: "I0",
      name: "asdf",
      needed: false,
    },
    {
      id: "I1",
      name: "zebra",
      needed: true,
    },
    {
      id: "I2",
      name: "another",
      needed: false,
    },
  ],
  stores: [
    {
      id: "S0",
      name: "FAKE SCHNUCKS",
      place_id: "xxxxxxxxxxxxx",
      vicinity: "vicinity",
    },
    {
      id: "S1",
      name: "Atlantic Mills",
      place_id: "ChIJsUfNv0jU2IcRk9KkjfWbBC0",
      vicinity: "14345 Manchester Road, Ballwin",
    },
  ],
};

class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy("navigate");
}

class MockDataIoService {
  public load(): Promise<Dto.AppInfo> {
    return Promise.resolve(mockDtoAppInfo);
  }
}

describe("About Component", () => {

  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent;

  beforeEach(() => {
    TestBed.overrideComponent(AboutComponent, {
      set: {
        template: "<div>Overridden template here</div>",
      },
    });

    TestBed.configureTestingModule({
      declarations: [AboutComponent],
    });

    fixture = TestBed
      .overrideComponent(AboutComponent, {
        set: {
          providers: [
            { provide: DataIoService, useClass: MockDataIoService },
            { provide: Router, useClass: MockRouter },
          ],
        },
      })
      .createComponent(AboutComponent);

    component = fixture.componentInstance;

  });

  it("shoud get json", async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      // const element = fixture.nativeElement;
      expect(component.jsonInfo.length).toBe(1007); // pretty fragile but effective
    });
  }));

});
