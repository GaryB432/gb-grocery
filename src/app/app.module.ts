import { NgModule, ApplicationRef } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { ToastModule, ToastsManager } from "ng2-toastr/ng2-toastr";

import { AboutComponent } from "./about/about.component";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { HomeItemComponent } from "./home/item.component";
import { ItemComponent } from "./item/item.component";
import { PickupComponent } from "./store/pickup.component";
import { StoreComponent } from "./store/store.component";
import { PlusIconComponent } from "./icons/plus";
import { TrashcanIconComponent } from "./icons/trashcan";
import { routing } from "./app.routing";

import { DataService } from "./shared/data.service";
import { DataIoService, LocalIoStorage } from "./shared/data.io.service";
import { LogicService } from "./shared/logic.service";
import { MomentPipe } from "./shared/moment.pipe";
import { TopToastsManager } from "./shared/toasts-manager";
import { HammerGesturesDirective } from "./shared/hammer-gestures.directive";

import { AbstractGeoCoder, GoogleGeoCoder, LocalGeoCoder } from "./store/geocoding.service";

import { removeNgStyles, createNewHosts } from "@angularclass/hmr";

const isLocal: boolean = window.location.hostname === "localhost-is-fun";

type NativeElement = any;
abstract class Store {
  public abstract disposeOldHosts(): void;
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    routing,
    ToastModule.forRoot()
  ],
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
    HammerGesturesDirective
  ],
  providers: [
    { provide: ToastsManager, useClass: TopToastsManager },
    { provide: AbstractGeoCoder, useClass: isLocal ? LocalGeoCoder : GoogleGeoCoder },
    DataService,
    DataIoService,
    LocalIoStorage,
    LogicService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(public appRef: ApplicationRef) { }
  public hmrOnInit(store: Store): void {
    console.log("HMR store", store);
  }
  public hmrOnDestroy(store: Store): void {
    const cmpLocation: NativeElement[] = this.appRef.components.map(cmp => cmp.location.nativeElement);
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
