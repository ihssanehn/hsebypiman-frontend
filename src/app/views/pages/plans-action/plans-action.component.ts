// Angular
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MenuAsideService, SubheaderService } from '../../../core/_base/layout';

@Component({
	selector: 'tf-plan-actions',
	templateUrl: './plans-action.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlansActionComponent implements OnInit {
	
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
		this.menuAsideService.loadMenuAside('aside.actions');
		this.subheaderService.loadSubheader('');
	}
}
