// Angular
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'tf-admin-users',
	templateUrl: './admin-users.component.html',
	styleUrls: ['./admin-users.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsersComponent implements OnInit {


	constructor(
		private router:Router,
	) {
	}

	ngOnInit(){
		
	}

	
}
