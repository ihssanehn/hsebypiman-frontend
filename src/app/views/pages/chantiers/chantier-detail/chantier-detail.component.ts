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
import Swal from 'sweetalert2';

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
		let url = this.router.url;
		url = `/chantiers/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
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
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Clore le chantier'
		}).then(async response => {
			if (response.value) {
				try {
					const res = await this.chantierService.closeChantier(chantierId).toPromise();
					if (res) {
						Swal.fire({
							icon: 'success',
							title: 'le chantier a été clos avec succès',
							showConfirmButton: false,
							timer: 1500
						}).then(() => {
							this.getChantier(chantierId);
						});
					} else {
						throw new Error();
					}
				} catch (e) {
					console.log(e);
					Swal.fire({
						icon: 'error',
						title: 'Echec! une erreur est survenue',
						showConfirmButton: false,
						timer: 1500
					});
				}
			}
		});
		
	}
  
	addAr(chantierId){
		if(this.chantier.montant < 20000){
			Swal.fire({
				icon: 'error',
				title: 'Le montant du chantier est inférieur à 20K€, vous ne pouvez pas créer d\'Analyse de risque',
				showConfirmButton: false,
				timer: 4000
			});
		}else{
			this.router.navigate(['analyses-risque/add'], {queryParams:{chantier_id:chantierId}})
		}
	}
}
