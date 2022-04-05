// Angular
import { Component, OnInit } from '@angular/core';
import { MenuAsideService } from '@app/core/_base/layout';

@Component({
	selector: 'tf-admin',
	templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

	constructor(
		private menuAsideService:MenuAsideService
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.menuAsideService.loadMenuAside('aside.params');
	}
}
