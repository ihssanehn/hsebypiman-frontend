// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
	selector: 'tf-demandes-epis',
	templateUrl: './demandes-epis.component.html'
})
export class DemandesEpisComponent implements OnInit {

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param menuAsideService
	 * @param router: Router
	 */
	constructor(
		private router: Router
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
	}
}
