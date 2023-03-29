import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'tf-widget-indicator',
	templateUrl: './widget-indicator.component.html',
	styleUrls: ['./widget-indicator.component.scss']
})
export class WidgetIndicatorComponent implements OnInit {

	@Input() value: string | number;
	@Input() desc: string;
	@Input() valueClass: string;

	constructor() {
	}

	ngOnInit() {
	}

}
