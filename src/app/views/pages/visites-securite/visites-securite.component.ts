// Angular
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAsideService } from '@app/core/_base/layout';

@Component({
	selector: 'tf-visites-securite',
	templateUrl: './visites-securite.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitesSecuriteComponent implements OnInit {

	constructor(
		private router:Router,
		private menuAsideService: MenuAsideService
	) {
	}

	async ngOnInit(){
		this.menuAsideService.loadMenuAside('aside.vss');
	}
}
