import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PickupComponent } from './pickup/pickup.component';
import { StoreComponent } from './store.component';

@NgModule({
  declarations: [StoreComponent, PickupComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class StoreModule {}
