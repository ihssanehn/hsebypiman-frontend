// Angular
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

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
		
		return moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
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
