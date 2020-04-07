import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { Location } from '@angular/common';
import { ChantierService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'tf-chantier-edit',
  templateUrl: './chantier-edit.component.html',
  styleUrls: ['./chantier-edit.component.scss']
})
export class ChantierEditComponent implements OnInit, OnDestroy {
  
  	chantier: Chantier;
	chantierForm: FormGroup;
	// allRoles: Role[];
	loaded: boolean = false;
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
		private location:Location
	) { }

	ngOnInit() {
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.createForm();
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
			this.chantierForm = this.chantierFB.group({
				nom: [res.nom, Validators.required],
				type_id : [res.type_id, Validators.required],
				adresse : [res.adresse, Validators.required],
				ville : [res.ville, Validators.required],
				code_postal : [res.code_postal, Validators.required],
				pays : [res.pays, Validators.required],
				client : [res.client, Validators.required],
				contact : [res.contact, Validators.required],
				montant : [res.montant, Validators.required],
				date_demarrage : [res.date_demarrage, Validators.required],
				charge_affaire_id : [res.charge_affaire_id, Validators.required],
				status_id : [res.status_id, Validators.required],
				numero : [res.numero, Validators.required],
			});
			this.loaded = true;
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

	createForm() {
		this.chantierForm = this.chantierFB.group({
			nom: ['', Validators.required],
			type_id : [null, Validators.required],
			adresse : ['', Validators.required],
			ville : ['', Validators.required],
			code_postal : ['', Validators.required],
			pays : ['', Validators.required],
			client : ['', Validators.required],
			contact : ['', Validators.required],
			montant : ['', Validators.required],
			date_demarrage : ['', Validators.required],
			charge_affaire_id : [null, Validators.required],
			status_id : [null, Validators.required],
			numero : ['', Validators.required],
		});
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
  
	  
	cancel(){
		this.location.back();
	}
}
