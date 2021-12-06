import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikerComponent } from './liker.component';

describe('LikerComponent', () => {
  let component: LikerComponent;
  let fixture: ComponentFixture<LikerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LikerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
