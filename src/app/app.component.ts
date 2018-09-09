import { Component } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface FakeStuff {
  name: string;
  uname: string;
  parent: string;
}

const input: FakeStuff[][] = [
  [
    { name: 'Polska', uname: 'polska', parent: '' },
    { name: 'Dolnośląskie', uname: 'dolnoslaskie', parent: 'polska' },
    { name: 'Wrocław', uname: 'wroclaw', parent: 'dolnoslaskie' },
  ],
];

@Component({
  selector: 'gbg-root',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public title = 'gb-grocery';
  public items: Observable<FakeStuff[]>;
  private itemsCollection: AngularFirestoreCollection<FakeStuff>;
  constructor(afs: AngularFirestore) {
    this.itemsCollection = afs.collection<FakeStuff>('items');
    this.items = this.itemsCollection.valueChanges();
  }
  public addFakeStuff() {
    input[0].forEach(i => {
      this.itemsCollection.add(i);
    });
    // console.log(i);
    // this.itemsCollection.add()
  }
}
