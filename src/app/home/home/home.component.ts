import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';

import { Item } from '../../models/item';
import { GestureEvent } from '../../shared/hammer-gestures.directive';
import { LogicService } from '../../shared/logic.service';

@Component({
  selector: 'gbg-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public items: Item[] = [];

  public newName = '';

  constructor(
    public afAuth: AngularFireAuth,
    private logic: LogicService,
    private toastr: ToastrService,
    vcr: ViewContainerRef
  ) {
    afAuth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        console.log(user.uid, user);
        // this.uid = user.uid;
        this.getUserItems();
      }
    });
  }

  public ngOnInit(): void {
    setTimeout(() => this.toastr.show('Swipe right on needed items.'), 0);
  }

  public addItem(): void {
    if (!!this.newName) {
      this.logic.insertItem(this.newName).then(_i => {
        this.getUserItems();
      });
    }
  }

  public doSwipe(e: GestureEvent, item: Item): void {
    switch (e.type) {
      case 'swipeleft':
        item.needed = false;
        break;
      case 'swiperight':
        item.needed = true;
        break;
      default:
        break;
    }
    this.logic.updateItem(item);
  }

  private getUserItems(): void {
    // console.log(this.uid);
    this.logic.load().then(info => {
      this.newName = '';
      return (this.items = info.items
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)));
    });
  }
}
