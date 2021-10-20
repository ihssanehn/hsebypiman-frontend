import {Component, OnInit} from '@angular/core';
import {MenuAsideService} from "@app/core/_base/layout";

@Component({
	selector: 'tf-guest',
	templateUrl: './guest.component.html'
})
export class GuestComponent implements OnInit {

	constructor(
	) {
	}

	ngOnInit() {
		// this.menuAsideService.loadMenuAside('aside.pdp');
	}

}
