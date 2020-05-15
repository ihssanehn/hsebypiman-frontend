import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { VisiteService, TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Visite } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
	selector: 'tf-visite-edit',
	templateUrl: './visite-edit.component.html',
	styleUrls: ['./visite-edit.component.scss']
})

export class VisiteEditComponent implements OnInit, OnDestroy {

	errors;
	visiteForm: FormGroup;
  	formStatus = new FormStatus();
	visite: Visite;
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
		private permissionsService: NgxPermissionsService,
		private location: Location,
		private subheaderService:SubheaderService,
	) {	}
	
	ngOnInit() {
		this.createForm();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.visiteService.get(id).pipe(
						tap(visite=>{
							this.visiteForm.patchValue(visite);
						})
					).subscribe( async res => {
						this.visite = res.result.data;
						this.loaded = true;
						this.cdr.detectChanges();
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/visites/list');
				}
			}
    );
    this.subscriptions.push(routeSubscription);
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
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.visiteForm = this.visiteFB.group({
			code:['', Validators.required],
			// nom: ['', Validators.required],
			// type_id: [null, Validators.required],
			// adresse: ['', Validators.required],
			// ville: ['', Validators.required],
			// code_postal: ['', Validators.required],
			// pays: ['', Validators.required],
			// client: ['', Validators.required],
			// contact: ['', Validators.required],
			// montant: ['', Validators.required],
			// date_demarrage: ['', Validators.required],
			// charge_affaire_id: [null, Validators.required],
			// status_id: [null, Validators.required],
			// numero: ['', Validators.required],
		});
	}

	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshVisite(id) {
		let url = this.router.url;
		url = `/visites/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			this.formStatus.onFormSubmitting();
			let form = {...this.visiteForm.value};
			form.date_demarrage = form.date_demarrage ? moment(form.date_demarrage).format('YYYY-MM-DD') : null
			  form.id = this.visite.id;
			  
			this.visiteService.update(form)
				.toPromise()
				.then((visite) => {
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: 'Chantié mis à jour avec succès',
						showConfirmButton: false,
						timer: 1500
					}).then(() => {
            			this.location.back();
					});
				})
				.catch(err => {

					Swal.fire({
						icon: 'error',
						title: 'Echec! le formulaire est incomplet',
						showConfirmButton: false,
						timer: 1500
					});

					if(err.status === 422){
						var messages = extractErrorMessagesFromErrorResponse(err);
						this.formStatus.onFormSubmitResponse({success: false, messages: messages});
						console.log(this.formStatus.errors, this.formStatus.canShowErrors());
						this.cdr.detectChanges();
						this.cdr.markForCheck();
					}
			
				});

			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	setDateFormat(date) {
		return date ? moment(date).format('YYYY-MM-DD') : null;
	}

	cancel() {
		this.location.back();
	}
}
