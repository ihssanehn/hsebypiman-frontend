// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MenuAsideService } from '../../../core/_base/layout';


@Component({
	selector: 'tf-remontees',
	templateUrl: './remontees.component.html'
})
export class RemonteesComponent implements OnInit {

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
		this.menuAsideService.loadMenuAside('aside.remontees');
	}
}
