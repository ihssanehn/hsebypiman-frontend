import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { CauserieService, } from '@app/core/services';
import { Causerie } from '@app/core/models';
import Swal from 'sweetalert2';
import { extractErrorMessagesFromErrorResponse } from '@app/core/_base/crud';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

@Component({
	selector: 'tf-causerie-edit',
	templateUrl: './causerie-edit.component.html',
	styleUrls: ['./causerie-edit.component.scss']
})

export class CauserieEditComponent implements OnInit, OnDestroy {

	errors;
	causerieForm: FormGroup;
	formStatus = new FormStatus();
	causerie: Causerie;
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
	 * @param causerieFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private causerieFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private causerieService: CauserieService,
		private translate: TranslateService,
		private cdr: ChangeDetectorRef,
		private location: Location,
		private dateFrToEnPipe:DateFrToEnPipe,
		private dateEnToFrPipe:DateEnToFrPipe,

	) {	}
	
	ngOnInit() {
		this.createForm();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.causerieService.get(id).pipe(
						tap(res=>{
							var causerie = res.result.data;
							this.parseCauserieDate(causerie, 'EnToFr');
							this.causerieForm.patchValue(causerie);
						})
					).subscribe( async res => {
						this.causerie = res.result.data;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/causeries/list');
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
		const url = `/causeries/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.causerieForm = this.causerieFB.group({
			libelle: [null, Validators.required],
			sujet: [null, [Validators.required]],
			organisateur_id: [null, Validators.required],
			date: [null, [Validators.required]],
			lieu: [null, [Validators.required]],
		});
	}
  
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshCauserie(id) {
		let url = this.router.url;
		url = `/causeries/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	async onSubmit(event) {
		try {
			this.formloading = true;
			this.formStatus.onFormSubmitting();
			let form = {...this.causerieForm.getRawValue()};
			this.parseCauserieDate(form, 'FrToEn');

			form.id = this.causerie.id;
			
			this.causerieService.update(form)
				.toPromise()
				.then((causerie) => {
					this.formloading = false;
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: this.translate.instant("CAUSERIES.NOTIF.CAUSERIE_UPDATED.TITLE"),
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
						title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
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

	parseCauserieDate(item, direction){
		item.date = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date) : this.dateEnToFrPipe.transform(item.date);
	}

}
