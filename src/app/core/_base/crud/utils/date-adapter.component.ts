import { NativeDateAdapter } from '@angular/material';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

export class DateMomentAdapter extends NativeDateAdapter {
  format(date: Date): string {
    return moment(date).format('DD/MM/YYYY');
  }

  parse(value: any): Date | null {
    if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
      return this.invalid();
    }
    return moment(value, 'DD/MM/YYYY', true).toDate();
  }
}
