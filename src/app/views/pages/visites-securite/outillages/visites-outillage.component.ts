// Angular
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuAsideService, SubheaderService } from '@app/core/_base/layout';

@Component({
	selector: 'tf-visites-outillage',
	templateUrl: './visites-outillage.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitesOutillageComponent implements OnInit {

	constructor(
		private router:Router,
		private menuAsideService: MenuAsideService,
		private subheaderService: SubheaderService
	) {
	}

	async ngOnInit(){
		this.menuAsideService.loadMenuAside('aside.vss_outillage');
	}
}
