// Angular
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Returns only fullName of User
 */
@Pipe({
	name: 'fullName'
})
export class FullNamePipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any, args?: any): any {
		if(!value){return ''}
		
		return value.prenom+' '+value.nom;
	}
}
/**
 * Returns only Initiales of string
 */
@Pipe({
	name: 'initiales'
})
export class InitialesPipe implements PipeTransform {

	/**
	 * Transform
	 *
	 * @param value: any
	 * @param args: any
	 */
	transform(value: any, args?: any): any {
		if(!value){return ''}
		return (value.prenom.split(' ').map(n => n[0]).join('')+value.nom.split(' ').map(n => n[0]).join('')+value.nom.split(' ').map(n => n[1]).join('')).toUpperCase(); 
	}
}
