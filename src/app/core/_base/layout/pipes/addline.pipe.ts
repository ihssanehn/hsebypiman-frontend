import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
	name: 'addLine'
})

export class addLinePipe implements PipeTransform {
	transform(value: string): any {
		return value.replace(/(?:,)/g, '\n');
	}
}
