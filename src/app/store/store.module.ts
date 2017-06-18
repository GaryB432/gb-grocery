import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StoreComponent } from './store.component';
import { StorePickupComponent } from './store-pickup/store-pickup.component';
import { AbstractGeoCoder, GoogleGeoCoder, LocalGeoCoder } from './geocoding.service';

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
