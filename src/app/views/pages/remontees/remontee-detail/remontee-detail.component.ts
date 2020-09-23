import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { RemonteeService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Remontee } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-remontee-detail',
  templateUrl: './remontee-detail.component.html',
  styleUrls: ['./remontee-detail.component.scss']
})
export class RemonteeDetailComponent implements OnInit, OnDestroy {
  
  	remonte: Remontee;
	remonteForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	displayedEEChantiersColumns: Array<any>;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param remonteFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private remonteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private remonteeService: RemonteeService,
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
					this.getRemonte(id);

				} else {
					this.router.navigateByUrl('/remontees/list');
				}
			}
		);
	}

  	async getRemonte(remonteId){
		try {
			var res = await this.remonteeService.get(remonteId).toPromise();
			this.remonte = res.result.data;
			if(this.remonte.type.code == 'INTERIM'){
				this.displayedEEChantiersColumns = [
					'number', 'name', 'client', 'status', 'charge_affaire', 
					'date_demarrage', 'date_demarrage_ee', 'interimaire'
				];
				this.cdr.markForCheck();

			}else{
				this.displayedEEChantiersColumns = [
					'number', 'name', 'client', 'status', 'charge_affaire', 
					'date_demarrage', 'date_demarrage_ee', 'ca_ee'
				];
				this.cdr.markForCheck();

			}
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
		const url = `/remontees/list`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}
  
	

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshRemonte(id) {
		let url = this.router.url;
		url = `/remontees/edit/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
  	}

	goToChantierDetail(id){
		let url = this.router.url;
		url = `/chantiers/detail/${id}`;
		this.router.navigateByUrl(url, { relativeTo: this.activatedRoute });
	}

  	editRemonte(id){
		this.router.navigateByUrl('remontees/edit/'+id);
	}
	deleteRemonte(id){
		Swal.fire({
			title:'Désolé cette fonctionnalité n\'a pas encore été implémentée',
			showConfirmButton: false,
            timer: 1500
		})
	}
	viewChantier(chantierId) {
		this.router.navigateByUrl('chantiers/detail/' + chantierId);
	}

}
