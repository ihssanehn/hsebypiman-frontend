// Angular
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';


@Component({
	selector: 'tf-admin-flashinfos',
	templateUrl: './admin-flashinfos.component.html',
	styleUrls: ['./admin-flashinfos.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFlashInfosComponent implements OnInit {


	constructor(
		private router:Router,
	) {
	}

	ngOnInit(){
		
	}

	
}
