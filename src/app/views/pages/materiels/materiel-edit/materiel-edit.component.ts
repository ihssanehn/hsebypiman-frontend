import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { MaterielService,TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Materiel } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
	selector: 'tf-materiel-edit',
	templateUrl: './materiel-edit.component.html',
	styleUrls: ['./materiel-edit.component.scss']
})

export class MaterielEditComponent implements OnInit, OnDestroy {

	errors;
	materielForm: FormGroup;
  	formStatus = new FormStatus();
	materiel: Materiel;
	// allRoles: Role[];
	loaded: boolean = false;
	formloading: boolean = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param materielFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private materielFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private materielService: MaterielService,
		private cdr: ChangeDetectorRef,
		private permissionsService: NgxPermissionsService,
		private location: Location,
		private subheaderService:SubheaderService,
	) {	}
	
	ngOnInit() {
		this.createForm();
    	this.setDynamicValidators();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.materielService.get(id).pipe(
						tap(res=>{
							this.materielForm.patchValue(res.result.data);
						})
					).subscribe( async res => {
						this.materiel = res.result.data;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/materiels/list');
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
		const url = `/materiels/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.materielForm = this.materielFB.group({
			raison_sociale: ['', Validators.required],
			type_id: [null, Validators.required],
			adresse: ['', [Validators]],
			ville: ['', [Validators]],
			code_postal: ['', [Validators]],
			pays: ['', [Validators]]
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.materielForm.get('no_hab_required');
	}
  
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshMateriel(id) {
		let url = this.router.url;
		url = `/materiels/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			this.formloading = true;
			this.formStatus.onFormSubmitting();
			let form = {...this.materielForm.getRawValue()};
			form.id = this.materiel.id;
			
			this.materielService.update(form)
				.toPromise()
				.then((materiel) => {
					this.formloading = false;
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: 'Materiel mise à jour avec succès',
						showConfirmButton: false,
						timer: 1500
					}).then(() => {
            			this.location.back();
					});
				})
				.catch(err => {
					this.formloading = false;

					Swal.fire({
						icon: 'error',
						title: 'Echec! le formulaire est incomplet',
						showConfirmButton: false,
						timer: 1500
					});

					if(err.status === 422){
						var messages = extractErrorMessagesFromErrorResponse(err);
						this.formStatus.onFormSubmitResponse({success: false, messages: messages});
						this.cdr.markForCheck();
					}
			
				});

			this.cdr.markForCheck();
		} catch (error) {
			this.formloading = false;
			console.error(error);
			throw error;
		}
	}

	cancel() {
		this.location.back();
	}
}
