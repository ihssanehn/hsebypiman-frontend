import { NativeDateAdapter } from '@angular/material';
import {Injectable} from '@angular/core';

/** Adapts the native JS Date for use with cdk-based components that work with dates. */
@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  parse(value: any): Date | null {
    
    if (typeof value === 'string'){
      
      var month = null;
      var day = null;
      var year = null;
      if (value.indexOf('/') > -1) {
        var res = value.split("/");           
        if (res.length > 1) {
          day = res[0]
          month = res[1];
          year = res[2];
        }                              
      }
      else {
        if (value.length == 8) {
          day = value.substring(0, 2);
          month = value.substring(2, 4);
          year = value.substring(4, 8);
        }            
      }
      if (isNaN(month) || isNaN(day) || isNaN(year)) {
          return null;
      }
      month = Number(month - 1);
      day = Number(day);
      year = Number(year);
      return new Date(year, month, day);
    }else{
      const timestamp = typeof value === 'number' ? value : Date.parse(value);
      return isNaN(timestamp) ? null : new Date(timestamp);
    }
  }

  // retirar quando for feito o merge da data por mmalerba
  format(date: Date, displayFormat: Object): string {
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    }
    else{
      date = new Date(Date.UTC(
        date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
        date.getMinutes(), date.getSeconds(), date.getMilliseconds()
      ));
        displayFormat = Object.assign({}, displayFormat, { timeZone: 'utc' });
      const dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
      return dtf.format(date).replace(/[\u200e\u200f]/g, '');
    }


  }
  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
} 

}