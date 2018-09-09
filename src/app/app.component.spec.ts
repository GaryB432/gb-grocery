import { async, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { RouterTestingModule } from '@angular/router/testing';
import { from } from 'rxjs';

import { AppComponent } from './app.component';

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

const collectionStub = {
  valueChanges: jasmine.createSpy('valueChanges').and.returnValue(data),
  add: jasmine.createSpy('add'),
};

const angularFiresotreStub = {
  collection: jasmine.createSpy('collection').and.returnValue(collectionStub),
};

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
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
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'gb-grocery'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('gb-grocery');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain(
      'Welcome to gb-grocery!'
    );
  }));
  it('should call afs', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app: AppComponent = fixture.debugElement.componentInstance;
    app.addFakeStuff();
    expect(collectionStub.add).toHaveBeenCalledTimes(3);

    // const result = service.getPath('wroclaw');
    // expect(result).toEqual(['Polska', 'Dolnośląskie', 'Wrocław']);
  });
  it('should be constructed', () => {
    // expect(service).toBeTruthy();
    expect(angularFiresotreStub.collection).toHaveBeenCalledTimes(4);
    expect(angularFiresotreStub.collection).toHaveBeenCalledWith('items');
  });
});
