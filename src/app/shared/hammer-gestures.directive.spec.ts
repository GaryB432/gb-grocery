import { ElementRef } from '@angular/core';

import { HammerGesturesDirective } from './hammer-gestures.directive';

describe('HammerGesturesDirective', () => {
  it('should create an instance', () => {
    const el = new ElementRef(document.createElement('div'));
    const directive = new HammerGesturesDirective(el);
    expect(directive).toBeTruthy();
  });
});
