// Angular
import { Component, Input, OnInit } from '@angular/core';
// Lodash
import { shuffle } from 'lodash';

export interface WidgetIndicatorItemData {
	title: string;
	desc: string;
	value: string;
	valueClass?: string;
}

@Component({
	selector: 'tf-widget-indicator-list',
	templateUrl: './widget-indicator-list.component.html',
	styleUrls: ['./widget-indicator-list.component.scss']
})
export class WidgetIndicatorListComponent implements OnInit {

	@Input() data: WidgetIndicatorItemData[];

	ngOnInit() {}

}
