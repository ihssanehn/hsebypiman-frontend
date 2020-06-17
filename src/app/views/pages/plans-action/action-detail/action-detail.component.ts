import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ActionService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Action } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'tf-action-detail',
  templateUrl: './action-detail.component.html',
  styleUrls: ['./action-detail.component.scss']
})
export class ActionDetailComponent implements OnInit, OnDestroy {
  
  	action: Action;
	actionForm: FormGroup;
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
	 * @param actionFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private actionFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private actionService: ActionService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon('status-encours',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/encours.svg'));
		iconRegistry.addSvgIcon('status-termine',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/termine.svg'));
	}

  	ngOnInit() {
	  	const routeSubscription = this.activatedRoute.params.subscribe(
		  	async params => {
			  	const id = params.id;
			  	if (id) {
					this.getAction(id);
				} else {
					this.router.navigateByUrl('/plans-action/list');
				}
			}
		);
	}

  	async getAction(actionId){
		try {
			var res = await this.actionService.get(actionId).toPromise();
			this.action = res.result.data;
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	goBackWithId() {
		const url = `/plans-action/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
	refreshAction(id) {
		this.router.navigateByUrl('/plans-action/edit/'+id);
  	}

	goToActionDetail(id){
		this.router.navigateByUrl('/plans-action/detail/'+id);
	}

	goToVsDetail(id){
		var actionable_type = this.action.actionable_type;
		switch(actionable_type){
			case 'VsChantier': var path = 'chantiers';break;
			case 'VsEpi': var path = 'epis';break;
			case 'VsOutillage': var path = 'outillages';break;
			case 'VsVehicule': var path = 'vehicules';break;
		}
		this.router.navigateByUrl('visites-securite/'+path+'/detail/'+id);
	}

  	editAction(id){
		this.router.navigateByUrl('plans-action/edit/'+id);
	}

	deleteAction(id){
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
            timer: 1500
		})
	}

	closeAction(actionId){
		
		Swal.fire({
			icon: 'warning',
			title: 'Voulez vous vraiment clore cette action ?',
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Clore le action'
		}).then(async response => {
			if (response.value) {
				const res = await this.actionService.closeAction(actionId)
				.toPromise()
				.then(res=>{
					var code = res.message.code as SweetAlertIcon;
					var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
					Swal.fire({
						icon: code,
						title: 'le action a été clos avec succès',
						showConfirmButton: false,
						html: message,
						timer: code == 'success' ? 1500 : 3000
					}).then(() => {
						this.getAction(actionId);
					})
				}).catch(e => {
					Swal.fire({
						icon: 'error',
						title: 'Echec! une erreur est survenue',
						showConfirmButton: false,
						timer: 1500
					});
				});
			}
		});
	}
}
