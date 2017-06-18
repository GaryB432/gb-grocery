import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HomeItemComponent } from './home-item/home-item.component';
// import { MomentPipe } from '../shared/moment.pipe';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    BrowserAnimationsModule,
  ],
  declarations: [
    HomeComponent,
    HomeItemComponent,
    // MomentPipe,
  ]
})
export class HomeModule { }
