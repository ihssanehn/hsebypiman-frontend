// Angular
import { Component, ContentChild, Input, OnInit, TemplateRef , Output, EventEmitter} from '@angular/core';
// Lodash
import { shuffle } from 'lodash';
// Layout
import { LayoutConfigService } from '../../../../../core/_base/layout';

@Component({
	selector: 'tf-widget2',
	templateUrl: './widget2.component.html',
	styleUrls: ['./widget2.component.scss']
})
export class Widget2Component implements OnInit {
	// Public properties
	@Input() data: any[] = [];
	@Input() label: string;
	@Input() hasLink: boolean = true;
	@Input() title: string;

	@ContentChild('actionTemplate', {static: true}) actionTemplate: TemplateRef<any>;

	@Output() onGoTo: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Component constructor
	 *
	 * @param layoutConfigService: LayoutConfigService
	 */
	constructor(private layoutConfigService: LayoutConfigService) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		
	}

	goTo(item){
		if(item.id){
			this.onGoTo.emit(item);
		}
	}
	
}
