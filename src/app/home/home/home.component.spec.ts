import { async, TestBed } from '@angular/core/testing';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { from } from 'rxjs';

import { HomeComponent } from './home.component';

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

const data = from(input);

const wtfReference: Partial<DocumentReference> = {
  id: 'wtf',
  path: 'path/to/wtf',
};

const collectionStub = {
  add: jasmine.createSpy('add').and.returnValue(Promise.resolve(wtfReference)),
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
};

const angularFiresotreStub = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: AngularFirestore,
          useValue: angularFiresotreStub,
        },
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'gb-grocery'`, async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('gb-grocery');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to gb-grocery!'
    );
  }));
  it('should call afs', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    const app: HomeComponent = fixture.debugElement.componentInstance;
    app.addFakeStuff();
    expect(collectionStub.add).toHaveBeenCalledTimes(3);

    // const result = service.getPath('wroclaw');
    // expect(result).toEqual(['Polska', 'Dolnośląskie', 'Wrocław']);
  }));
  it('should be constructed', () => {
    // expect(service).toBeTruthy();
    expect(angularFiresotreStub.collection).toHaveBeenCalledTimes(4);
    expect(angularFiresotreStub.collection).toHaveBeenCalledWith('items');
  });
});
