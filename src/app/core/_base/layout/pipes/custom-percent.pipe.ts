// Angular
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns only first letter of string
 */
@Pipe({
	name: 'customPercent'
})
export class CustomPercentPipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any, args?: any): any {
		if(!value){
			return null
		}else if(isNaN(value)){
			return value
		}

		value = Math.round(value*100);
		return value+' %';
	}
}
