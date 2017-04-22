/* tslint:disable:max-classes-per-file */

import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { DataService } from "../shared/data.service";
import { LogicService } from "../shared/logic.service";
import { AppInfo } from "../shared/models";
import { AbstractGeoCoder, LocalGeoCoder } from "./geocoding.service";
import { StoreComponent } from "./store.component";

// class MockLogicService {
//   private info: AppInfo = {
//     stores: undefined,
//     items: undefined,
//     checkouts: undefined
//   };

//   public load(): Promise<AppInfo> {
//     const today: Date = new Date(2034, 5, 6);

//     this.info.stores = [new Store("1", "ONE"), new Store("2", "TWO")];
//     this.info.items = ["A", "B"].map((s) => {
//       const item: Item = new Item();
//       item.id = s;
//       item.name = `ITEM ${s}`;
//       return item;
//     });
//     this.info.checkouts = [new Checkout(this.info.stores[0], today)];
//     return new Promise<AppInfo>((resolve, reject) => resolve(this.info));
//   }
//   public getStoresFromNearbyPlaces(places: google.maps.places.PlaceResult[]): Store[] {
//     throw new Error("oh noes");
//     // return [];
//   }
// }

// class MockLocalStorage {
//   public setItem: jasmine.Spy = jasmine.createSpy("setItem");
//   public getItem: jasmine.Spy = jasmine.createSpy("getItem");
// }

class MockDataService {
  public load(): Promise<AppInfo> {
    return Promise.resolve(undefined);
  }
}
class MockRouter {
  public navigate: jasmine.Spy = jasmine.createSpy("navigate");
}
xdescribe("Store Component", () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StoreComponent,
      ],
      imports: [
        FormsModule,
      ],
      providers: [
        { provide: LogicService, useClass: LogicService },
        { provide: AbstractGeoCoder, useClass: LocalGeoCoder },
        { provide: DataService, useClass: MockDataService },
        { provide: Router, useClass: MockRouter },
      ],
    });
  });

  it("should have aisles", async(() => {
    // Overrides here, if you need them
    TestBed.overrideComponent(StoreComponent, {
      set: {
        template: "<div>Overridden template something here</div>",
      },
    });

    TestBed.compileComponents().then(() => {
      const fixture: ComponentFixture<StoreComponent> = TestBed.createComponent(StoreComponent);

      // Access the dependency injected component instance
      const app: StoreComponent = fixture.componentInstance;

      // app.ngOnInit();

      // it("should have aisles", () => {
      //     const fixture: ComponentFixture<StoreComponent> = TestBed.createComponent(StoreComponent);
      //     // const component: StoreComponent = fixture.componentInstance;

      //     // component.pickup = new Pickup(new Item(), "A1");
      //     // function newStore() {
      //     //     return new Store("a", undefined)
      //     // };
      //     // let s: Store = {
      //     //     formattedAddress: "a",
      //     //     formattedPhoneNumber: "B"
      //     // };
      //     // component.stores = [new Store("A", undefined)];
      //     // component.selectedStorePlaceId = "1";
      //     // component.changeStore();

      //     // fixture.detectChanges();

      //     // expect(component.aisles.length).toBeGreaterThan(0);

      //     expect(fixture.nativeElement.children[0].textContent).toContain("hi");
      // });

      expect(app.aisles).toBeDefined();

      // Access the element
      const element: Element = fixture.nativeElement;

      // Detect changes as necessary
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(element.textContent).toContain("something");
      });

    });
  }));
});
