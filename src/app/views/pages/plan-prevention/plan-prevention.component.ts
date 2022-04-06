import {Component, OnInit} from '@angular/core';
import {MenuAsideService} from "@app/core/_base/layout";

@Component({
	selector: 'tf-plan-prevention',
	templateUrl: './plan-prevention.component.html'
})
export class PlanPreventionComponent implements OnInit {

	constructor(
		public menuAsideService: MenuAsideService,
	) {
	}

	ngOnInit() {
		this.menuAsideService.loadMenuAside('aside.pdp');
	}

}
