// Angular
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAsideService } from '@app/core/_base/layout';

@Component({
	selector: 'tf-salaries',
	templateUrl: './salaries.component.html',
	styleUrls: ['salaries.component.scss'],
})
export class SalariesComponent implements OnInit {

	constructor(
		public menuAsideService: MenuAsideService,
		private router: Router
	) {
	}

	ngOnInit(){
		this.menuAsideService.loadMenuAside('aside.salaries');
	}
}
