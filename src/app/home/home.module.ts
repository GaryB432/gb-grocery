import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { HomeItemComponent } from './home-item/home-item.component';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeItemComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    BrowserAnimationsModule,
  ],
})
export class HomeModule { }
