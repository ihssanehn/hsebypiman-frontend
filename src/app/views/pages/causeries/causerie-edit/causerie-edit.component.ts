import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { FileUploader } from 'ng2-file-upload';
import moment from 'moment';

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

	public uploader:FileUploader = new FileUploader({
		isHTML5: true
	});

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
							const documentArray = this.causerieForm.get('documents') as FormArray;
							for (let i = 0; i < res.result.data.documents.length; i++) {
								const item = res.result.data.documents[i];
								var document = this.causerieFB.group({
									libelle: [item.libelle],
									id: [item.id, Validators.required],
								});
								documentArray.push(document);
							}
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
			creator_id:[{value: null, disabled: true}],
			date: [null, [Validators.required]],
			lieu: [null, [Validators.required]],
			documentsToUpload: [null, null],
			documents: new FormArray([])
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
			let formData = new FormData();
			let form = {...this.causerieForm.getRawValue()};

			for (let j = 0; j < this.uploader.queue.length; j++) {
				let fileItem = this.uploader.queue[j]._file;
				formData.append('documents[]', fileItem);
			}

			Object.keys(form).map(function (key) {
				if(form[key] && key != "documents")
				  return formData.append(key, form[key]);
			})

			if(form.date)
				formData.set('date', moment(form.date).format('YYYY-MM-DD'));
			else formData.set('date', '');

			formData.set('id', ''+this.causerie.id);
			
			this.causerieService.update(this.causerie.id, formData)
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
						this.uploader.clearQueue();
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

	controlDocuments() {
		for (let i = 0; i < this.uploader.queue.length; i++) {
		  let fileItem = this.uploader.queue[i]._file;
		  if(fileItem.size > 10000000){
			alert(this.translate.instant("REMONTEES.NOTIF.FILE_SIZE_ALERT.TITLE"));
			return true;
		  }
		}
			
		return false
	}

}
