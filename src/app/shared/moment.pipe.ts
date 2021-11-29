import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'gbgMoment', pure: false })
export class MomentPipe implements PipeTransform {
  public transform(value: Date | null | undefined): string | null {
    return value ? moment(value).fromNow() : null;
  }
}
