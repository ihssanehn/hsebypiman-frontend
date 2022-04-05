// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAsideService } from '@app/core/_base/layout';

@Component({
	selector: 'tf-suivi-hse',
	templateUrl: './suivi-hse.component.html',
	styleUrls: ['suivi-hse.component.scss'],
})
export class SuiviHseComponent implements OnInit {

	constructor(
		public menuAsideService: MenuAsideService,
		private router: Router
	) {
	}

	ngOnInit(){
		this.menuAsideService.loadMenuAside('aside.suiviHse');
	}
}
