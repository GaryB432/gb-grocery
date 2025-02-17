// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { AppComponent } from './app.component';

// describe('AppComponent', () => {
//   let component: AppComponent;
//   let fixture: ComponentFixture<AppComponent>;

//   beforeEach(async(() => {
//     void TestBed.configureTestingModule({
//       declarations: [ AppComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule],
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('GB Grocery');
  }));
});
