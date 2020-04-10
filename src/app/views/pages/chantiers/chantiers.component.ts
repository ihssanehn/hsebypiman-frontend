// Angular
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
// AppState
import { AppState } from '../../../core/reducers';
// Auth
import {ChantierService} from '@app/core/services';
import {MenuAsideService } from '../../../core/_base/layout';

@Component({
	selector: 'tf-chantiers',
	templateUrl: './chantiers.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChantiersComponent implements OnInit {
	
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
		this.menuAsideService.loadMenuAside('aside.chantiers');
	}
}
