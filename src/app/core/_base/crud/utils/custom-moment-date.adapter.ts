import { NativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import {Injectable, Optional, Inject} from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';


@Injectable()
export class CustomMomentDateAdapter extends MomentDateAdapter {

  constructor( @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }
  
  parse(value, parseFormat) {
    if (value && typeof value == 'string') {
      console.log(moment(value, parseFormat, this.locale, true));
      return moment(value, parseFormat, this.locale, true);
    }
    return value ? moment(value).locale(this.locale) : undefined;
  }
}

export const YEAR_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};