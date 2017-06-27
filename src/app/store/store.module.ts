import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AbstractGeoCoder, GoogleGeoCoder, LocalGeoCoder } from './geocoding.service';
import { StorePickupComponent } from './store-pickup/store-pickup.component';
import { StoreComponent } from './store.component';

const isLocal: boolean = window.location.hostname === 'localhost-not';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  providers: [
    { provide: AbstractGeoCoder, useClass: isLocal ? LocalGeoCoder : GoogleGeoCoder },
  ],
  declarations: [StoreComponent, StorePickupComponent]
})
export class StoreModule { }
