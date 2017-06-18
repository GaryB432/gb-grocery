import { HammerGesturesDirective } from './hammer-gestures.directive';
import { ElementRef } from '@angular/core';

describe('HammerGesturesDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(document.createElement('div'));
    const directive = new HammerGesturesDirective(el);
    expect(directive).toBeTruthy();
  });
});
