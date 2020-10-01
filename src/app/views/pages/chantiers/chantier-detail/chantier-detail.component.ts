import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ChantierService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-chantier-detail',
  templateUrl: './chantier-detail.component.html',
  styleUrls: ['./chantier-detail.component.scss']
})
export class ChantierDetailComponent implements OnInit, OnDestroy {
  
  	chantier: Chantier;
	chantierForm: FormGroup;
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
	 * @param chantierFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private chantierFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private chantierService: ChantierService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		private translate: TranslateService,
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
					this.getChantier(id);

				} else {
					this.router.navigateByUrl('/chantiers/list');
				}
			}
		);
	}

  	async getChantier(chantierId){
		try {
			var res = await this.chantierService.get(chantierId).toPromise();
			this.chantier = res.result.data;
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
		const url = `/chantiers/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
	

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshChantier(id) {
		this.router.navigateByUrl('/chantiers/edit/'+id);
  	}

	goToArDetail(id){
		this.router.navigateByUrl('/analyses-risque/detail/'+id);
	}

	goToVsDetail(id){
		this.router.navigateByUrl('visites-securite/chantiers/detail/'+id);
	}

  	editChantier(id){
		this.router.navigateByUrl('chantiers/edit/'+id);
	}
	deleteChantier(id){
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
            timer: 1500
		})
	}

	closeChantier(chantierId){
		
		Swal.fire({
			icon: 'warning',
			title: 'Voulez vous vraiment clore ce chantier ?',
			text:'Les analyses de risque et visites de chantier seront archivés.',
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: 'Clore le chantier'
		}).then(async response => {
			if (response.value) {
				const res = await this.chantierService.closeChantier(chantierId)
				.toPromise()
				.then(res=>{
					var code = res.message.code as SweetAlertIcon;
					var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
					Swal.fire({
						icon: code,
						title: 'le chantier a été clos avec succès',
						showConfirmButton: false,
						html: message,
						timer: code == 'success' ? 1500 : 3000
					}).then(() => {
						this.getChantier(chantierId);
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
  
	addAr(chantierId){
		if(this.chantier.montant <= 20000){
			Swal.fire({
				icon: 'error',
				title: 'Le montant du chantier est inférieur ou égal à 20K€, vous ne pouvez pas créer d\'analyse de risque',
				showConfirmButton: false,
				timer: 4000
			});
		}else{
			if(!this.chantier.is_all_ars_archived){
				Swal.fire({
					icon: 'warning',
					title: 'Vous allez créer une Analyse de risque',
					html: '<p class="text-warning"><b>L\'analyse de risque en cours sur ce chantier sera archivée</b></p><p>Voulez-vous continuer ?</p>',
					showConfirmButton: true,
					showCancelButton: true,
					cancelButtonText: this.translate.instant("ACTION.CANCEL"),
					confirmButtonText: this.translate.instant("ACTION.CONFIRM")
				}).then(async response => {
					if (response.value) {
						this.router.navigate(['analyses-risque/add'], {queryParams:{chantier_id:chantierId}})
					}
				});
			}else{
				this.router.navigate(['analyses-risque/add'], {queryParams:{chantier_id:chantierId}});
			}
		}
	}
}
