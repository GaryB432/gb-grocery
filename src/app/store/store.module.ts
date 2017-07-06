import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { GeoModule } from '../shared/geo/geo.module';
import { StorePickupComponent } from './store-pickup/store-pickup.component';
import { StoreComponent } from './store.component';

@NgModule({
  declarations: [
    StoreComponent,
    StorePickupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    GeoModule,
    RouterModule,
  ],
})
export class StoreModule { }
