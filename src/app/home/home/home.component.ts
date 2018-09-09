import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
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
  selector: 'gbg-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  public title = 'gb-grocery';
  public items: Observable<FakeStuff[]>;
  private itemsCollection: AngularFirestoreCollection<FakeStuff>;
  constructor(afs: AngularFirestore) {
    this.itemsCollection = afs.collection<FakeStuff>('items');
    this.items = this.itemsCollection.valueChanges();
  }
  public ngOnInit() {}
  public addFakeStuff() {
    input[0].forEach(async fakeStuff => {
      const ref: DocumentReference = await this.itemsCollection.add(fakeStuff);
      const { id, path } = ref;
      console.log(id, path);
    });
  }
}
