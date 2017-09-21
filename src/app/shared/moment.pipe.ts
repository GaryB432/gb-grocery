import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'gbgMoment', pure: false })
export class MomentPipe implements PipeTransform {
  public transform(value: Date): string | null {
    if (value === null) {
      return null;
    }

    return moment(value).fromNow();
  }
}
