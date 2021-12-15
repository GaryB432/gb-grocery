import { Component, ViewContainerRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Item } from '../../models/item';
import { GestureEvent } from '../../shared/hammer-gestures.directive';
import { LogicService } from '../../shared/logic.service';

@Component({
  selector: 'gbg-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public items: Item[] = [];

  public newName = '';

  public constructor(
    public afAuth: AngularFireAuth,
    private logic: LogicService,
    vcr: ViewContainerRef
  ) {
    afAuth.authState.subscribe((user: firebase.User | null) => {
      if (user) {
        // this.uid = user.uid;
        this.getUserItems();
      }
    });
  }

  public addItem(): void {
    if (this.newName) {
      this.logic
        .insertItem(this.newName)
        .then((_i) => {
          this.getUserItems();
        })
        .catch((e) => console.error(e));
    }
  }

  public addReady(): boolean {
    return this.newName.length > 0;
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
    void this.logic.updateItem(item);
  }

  private getUserItems(): void {
    this.logic
      .load()
      .then((info) => {
        this.newName = '';
        return (this.items = info.items
          .slice()
          .sort(
            (a, b) =>
              (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1) ||
              a.name.localeCompare(b.name)
          ));
      })
      .catch((e) => console.error(e));
  }
}
