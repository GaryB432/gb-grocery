import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeItemComponent } from './home-item/home-item.component';
import { HomeComponent } from './home/home.component';
import { LikerComponent } from './liker/liker.component';
import { LikerDirective } from './liker.directive';

@NgModule({
  declarations: [HomeComponent, HomeItemComponent, LikerComponent, LikerDirective],
  imports: [CommonModule, FormsModule, RouterModule, SharedModule],
})
export class HomeModule {}
