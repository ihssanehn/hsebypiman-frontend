// Angular
import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

/**
 * Returns only first letter of string
 */
@Pipe({
	name: 'dateTimeMessage'
})
export class DateTimeMessagePipe implements PipeTransform {

	transform(date: any): string {

		const FR = 'DD MMM YYYY, HH:mm';
		const EN = 'MMM DD YYYY, h:mm a';
		let format = FR;
	
		moment.locale('fr');
	
		const localLang: string = localStorage.getItem('language');
		if(localLang === 'en'){
		  format = EN;
		}
		if (localLang) {
		  moment.locale(localLang);
		}
	
		return (date) ? moment(date).format(format) : '';
	  }

}

@Pipe({
	name: 'dateMessage'
})
export class DateMessagePipe implements PipeTransform {

	transform(date: any): string {

		const FR = 'DD MMM YYYY';
		const EN = 'MMM DD YYYY';
		let format = FR;
	
		moment.locale('fr');
	
		const localLang: string = localStorage.getItem('language');
		if(localLang === 'en'){
		  format = EN;
		}
		if (localLang) {
		  moment.locale(localLang);
		}
	
		return (date) ? moment(date).format(format) : '';
	  }

}
