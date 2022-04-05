import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Pipe({
	name: 'pdpFilter'
})
@Injectable()
export class PdpFilterItemsPipe implements PipeTransform {
	transform(items: any[]): any[] {
		if (!items) return [];
		return items.filter(it =>
			it['answer'] === 1);
	}
}
