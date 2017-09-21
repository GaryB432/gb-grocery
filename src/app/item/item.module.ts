import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ItemComponent } from './item.component';

@NgModule({
  declarations: [ItemComponent],
  imports: [CommonModule, RouterModule, SharedModule],
})
export class ItemModule {}
