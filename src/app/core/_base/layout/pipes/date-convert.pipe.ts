// Angular
import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
import { MatExpansionPanelDescription } from '@angular/material';

/**
 * Returns only first letter of string
 */
@Pipe({
	name: 'DateFrToEnPipe'
})
export class DateFrToEnPipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any, args?: any): any {
		if(!value){
			return null
		}

		return moment(value, ['D/M/YYYY', 'DD/MM/YYYY']).format('YYYY-MM-DD') ;
	}
}
/**
 * Returns only first letter of string
 */
@Pipe({
	name: 'DateEnToFrPipe'
})
export class DateEnToFrPipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any, args?: any): any {
		if(!value){
			return null
		}
		
		return moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
	}
}
