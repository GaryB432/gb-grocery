import { TestBed, ComponentFixture } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";

import { HomeItemComponent } from "./item.component";
import { Item, Checkout, Store } from "../shared/models";

describe("Home Item Component", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [FormsModule], declarations: [HomeItemComponent] });
        TestBed.overrideComponent(HomeItemComponent, { set: { template: "<div>hi</div>" } });
    });

    it("should get recent checkout", () => {
        const fixture: ComponentFixture<HomeItemComponent> = TestBed.createComponent(HomeItemComponent);
        const component: HomeItemComponent = fixture.componentInstance;
        component.item = new Item();

        const stores: Store[] = [0, 1, 2, 3, 4].map(n => new Store(`S${n}`, `Store ${n}`));

        component.item.checkouts = [
            new Checkout(stores[1], new Date("2016-04-16T07:55:26.754Z")),
            new Checkout(stores[2], new Date("2016-03-16T07:55:26.754Z")),
            new Checkout(stores[0], new Date("2016-07-16T07:55:26.754Z")),
            new Checkout(stores[3], new Date("2016-06-16T07:55:26.754Z"))
        ];

        fixture.detectChanges();

        expect(component.recentCheckout.store).toBe(stores[0]);

        expect(fixture.nativeElement.children[0].textContent).toContain("hi");
    });

});
