/* tslint:disable:max-classes-per-file no-console */

import { ApplicationRef, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { createNewHosts, removeNgStyles } from "@angularclass/hmr";
import { ToastModule, ToastsManager } from "ng2-toastr/ng2-toastr";

import { AboutComponent } from "./about/about.component";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { HomeComponent } from "./home/home.component";
import { HomeItemComponent } from "./home/item.component";
import { PlusIconComponent } from "./icons/plus";
import { TrashcanIconComponent } from "./icons/trashcan";
import { ItemComponent } from "./item/item.component";
import { DataIoService, LocalIoStorage } from "./shared/data.io.service";
import { DataService } from "./shared/data.service";
import { HammerGesturesDirective } from "./shared/hammer-gestures.directive";
import { LogicService } from "./shared/logic.service";
import { MomentPipe } from "./shared/moment.pipe";
import { TopToastsManager } from "./shared/toasts-manager";
import { AbstractGeoCoder, GoogleGeoCoder, LocalGeoCoder } from "./store/geocoding.service";
import { PickupComponent } from "./store/pickup.component";
import { StoreComponent } from "./store/store.component";

const isLocal: boolean = window.location.hostname === "localhost-is-fun";

type NativeElement = any;
abstract class Store {
  public abstract disposeOldHosts(): void;
}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AboutComponent,
    AppComponent,
    HomeComponent,
    HomeItemComponent,
    ItemComponent,
    PickupComponent,
    StoreComponent,
    MomentPipe,
    TrashcanIconComponent,
    PlusIconComponent,
    HammerGesturesDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    routing,
    ToastModule.forRoot(),
  ],
  providers: [
    { provide: ToastsManager, useClass: TopToastsManager },
    { provide: AbstractGeoCoder, useClass: isLocal ? LocalGeoCoder : GoogleGeoCoder },
    DataService,
    DataIoService,
    LocalIoStorage,
    LogicService,
  ],
})

export class AppModule {
  constructor(public appRef: ApplicationRef) { }
  public hmrOnInit(store: Store): void {
    console.log("HMR store", store);
  }
  public hmrOnDestroy(store: Store): void {
    const cmpLocation: NativeElement[] = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  public hmrAfterDestroy(store: Store): void {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
