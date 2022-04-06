// Angular
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy,  } from '@angular/core';
import { Router } from '@angular/router';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { Store, select } from '@ngrx/store';
// AppState
import { AppState } from '../../../core/reducers';
// Auth
import {UserService} from '@app/core/services';
import {MenuAsideService, SubheaderService } from '../../../core/_base/layout';

@Component({
	selector: 'tf-profile',
	templateUrl: './discuss.component.html',
	styleUrls: ['./discuss.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiscussComponent implements OnInit {

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 * @param menuAsideService
	 * @param router: Router
	 */
	constructor(
		public menuAsideService: MenuAsideService,
		public subheaderService: SubheaderService,
		private router: Router
	) {
	}

	/**
	 * On init
	 */
	ngOnInit() {
		this.menuAsideService.loadMenuAside('aside.dashboard');
		// this.subheaderService.loadSubheader('');
	}



	
}
