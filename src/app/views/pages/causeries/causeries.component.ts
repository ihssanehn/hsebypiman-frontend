// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MenuAsideService } from '../../../core/_base/layout';


@Component({
	selector: 'tf-causeries',
	templateUrl: './causeries.component.html'
})
export class CauseriesComponent implements OnInit {

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param menuAsideService
	 * @param router: Router
	 */
	constructor(
		public menuAsideService: MenuAsideService,
		private router: Router
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.menuAsideService.loadMenuAside('aside.causeries');
	}
}
