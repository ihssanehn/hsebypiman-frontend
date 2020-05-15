import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { EntrepriseService,TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Entreprise } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
	selector: 'tf-entreprise-edit',
	templateUrl: './entreprise-edit.component.html',
	styleUrls: ['./entreprise-edit.component.scss']
})

export class EntrepriseEditComponent implements OnInit, OnDestroy {

	errors;
	entrepriseForm: FormGroup;
  	formStatus = new FormStatus();
	entreprise: Entreprise;
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
	 * @param entrepriseFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private entrepriseFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private entrepriseService: EntrepriseService,
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
					this.entrepriseService.get(id).pipe(
						tap(res=>{
							this.entrepriseForm.patchValue(res.result.data);
						})
					).subscribe( async res => {
						this.entreprise = res.result.data;
						this.loaded = true;
						this.cdr.detectChanges();
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/entreprises/list');
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
		const url = `/entreprises/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.entrepriseForm = this.entrepriseFB.group({
			raison_sociale: ['', Validators.required],
			type_id: [null, Validators.required],
			adresse: ['', [Validators]],
			ville: ['', [Validators]],
			code_postal: ['', [Validators]],
			pays: ['', [Validators]]
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.entrepriseForm.get('no_hab_required');
	}
  
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshEntreprise(id) {
		let url = this.router.url;
		url = `/entreprises/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			this.formStatus.onFormSubmitting();
			let form = {...this.entrepriseForm.value};
			form.id = this.entreprise.id;
			
			this.entrepriseService.update(form)
				.toPromise()
				.then((entreprise) => {
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: 'Entreprise mise à jour avec succès',
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

	cancel() {
		this.location.back();
	}
}
