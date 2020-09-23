import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { RemonteeService,TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Remontee } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
	selector: 'tf-remontee-edit',
	templateUrl: './remontee-edit.component.html',
	styleUrls: ['./remontee-edit.component.scss']
})

export class RemonteeEditComponent implements OnInit, OnDestroy {

	errors;
	remonteForm: FormGroup;
  	formStatus = new FormStatus();
	remonte: Remontee;
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
					this.remonteeService.get(id).pipe(
						tap(res=>{
							this.remonteForm.patchValue(res.result.data);
						})
					).subscribe( async res => {
						this.remonte = res.result.data;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/remontees/list');
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
		const url = `/remontees/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.remonteForm = this.remonteFB.group({
			description: ['', Validators.required],
			type_id: [null, Validators.required],
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.remonteForm.get('no_hab_required');
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
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			this.formloading = true;
			this.formStatus.onFormSubmitting();
			let form = {...this.remonteForm.getRawValue()};
			form.id = this.remonte.id;
			
			this.remonteeService.update(form)
				.toPromise()
				.then((remonte) => {
					this.formloading = false;
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: 'Remontée QHSE mise à jour avec succès',
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
