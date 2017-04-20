import { ModuleWithProviders } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { HomeComponent } from "./home/home.component";
import { ItemComponent } from "./item/item.component";
import { StoreComponent } from "./store/store.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "store", component: StoreComponent },
  { path: "about", component: AboutComponent },
  { path: "item/:id", component: ItemComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
