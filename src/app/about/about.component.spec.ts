/* tslint:disable:max-classes-per-file */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { DataIoService } from "../shared/data.io.service";
import { IDtoAppInfo } from "../shared/interfaces";
import { AboutComponent } from "./about.component";

const mockDtoAppInfo: IDtoAppInfo = {
  stores: [
    {
      name: "FAKE SCHNUCKS",
      vicinity: "vicinity",
      place_id: "xxxxxxxxxxxxx",
      id: "S0",
    },
    {
      name: "Atlantic Mills",
      place_id: "ChIJsUfNv0jU2IcRk9KkjfWbBC0",
      vicinity: "14345 Manchester Road, Ballwin",
      id: "S1",
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
  checkouts: [
    {
      storeId: "S1",
      isoDate: "2016-04-03T04:45:38.582Z",
      pickups: [{ itemId: "I1", aisle: "K9" }, { itemId: "I0", aisle: "D10" }],
    },
    {
      storeId: "S0",
      isoDate: "2016-04-03T05:35:18.334Z",
      pickups: [{ itemId: "I0", aisle: "S0-D10" }],
    },
  ],
};

class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy("navigate");
}

class MockDataIoService {
  public load(): Promise<IDtoAppInfo> {
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
