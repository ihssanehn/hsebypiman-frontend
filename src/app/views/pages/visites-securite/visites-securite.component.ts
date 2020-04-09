// Angular
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'tf-visites-securite',
	templateUrl: './visites-securite.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitesSecuriteComponent implements OnInit {

	constructor(
		private router:Router
	) {
	}

	async ngOnInit(){
	}
}
