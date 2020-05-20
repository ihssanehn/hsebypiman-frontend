import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { VisiteService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Visite } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-visite-chantier-detail',
  templateUrl: './visite-chantier-detail.component.html',
  styleUrls: ['./visite-chantier-detail.component.scss']
})
export class VisiteChantierDetailComponent implements OnInit, OnDestroy {
  
  	visite: Visite;
	visiteForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param visiteFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
	) {}

  	ngOnInit() {
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getVisite(id);
				} else {
					this.router.navigateByUrl('/visites/list');
				}
			}
		);
	}

  	async getVisite(visiteId){
		try {
			var res = await this.visiteService.get(visiteId).toPromise();
			this.visite = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/visites/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
	

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	// refreshVisite(id) {
	// 	let url = this.router.url;
	// 	url = `/visites/edit/${id}`;
	// 	this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  	// }

  	// editVisite(id){
	// 	this.router.navigateByUrl('visites/edit/'+id);
	// }
	// deleteVisite(id){
	// 	Swal.fire({
	// 		title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
	// 		showConfirmButton: false,
    //         timer: 1500
	// 	})
	// }
  
}
