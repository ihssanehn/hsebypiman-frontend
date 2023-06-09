// Angular
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAsideService, SubheaderService } from '@app/core/_base/layout';

@Component({
	selector: 'tf-visites-securite',
	templateUrl: './visites-securite.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitesSecuriteComponent implements OnInit {

	constructor(
		private router:Router,
		private menuAsideService: MenuAsideService,
		private subheaderService: SubheaderService
	) {
	}

	async ngOnInit(){
		this.subheaderService.loadSubheader('subheader.visites-securite');
	}
}
