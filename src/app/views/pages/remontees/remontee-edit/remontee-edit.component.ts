import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { RemonteeService } from '@app/core/services';
import { Remontee } from '@app/core/models';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";
import { TranslateService } from '@ngx-translate/core';
import { DateFrToEnPipe } from '@app/core/_base/layout';


@Component({
	selector: 'tf-remontee-edit',
	templateUrl: './remontee-edit.component.html',
	styleUrls: ['./remontee-edit.component.scss']
})

export class RemonteeEditComponent implements OnInit, OnDestroy {

	errors;
	remonteeForm: FormGroup;
	formStatus = new FormStatus();
	remontee: Remontee;
	loaded: boolean = false;
	formloading: boolean = false;
	editMode: boolean = false;
	private subscriptions: Subscription[] = [];

	public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });

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
		private remonteeService: RemonteeService,
		private cdr: ChangeDetectorRef,
		private location: Location,
		private translate:TranslateService,
		private dateFrToEnPipe:DateFrToEnPipe,
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
							this.remonteeForm.patchValue(res.result.data);
							const documentArray = this.remonteeForm.get('documents') as FormArray;
							for (let i = 0; i < res.result.data.documents.length; i++) {
								const item = res.result.data.documents[i];
								var document = this.remonteFB.group({
									libelle: [item.libelle],
									id: [item.id, Validators.required],
								});
								documentArray.push(document);
							}
						})
					).subscribe( async res => {
						this.remontee = res.result.data;
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
		this.remonteeForm = this.remonteFB.group({
			id: [null, Validators.required],
			description: ['', Validators.required],
			type_id: [null, Validators.required],
			event_date: [new Date(), null],
      		event_location_type_id: [null, null],
			event_type_id: [null, null],
			facts: ['', null],
			is_victims: [0, null],
			actions: ['', null],
			documentsToUpload: [null, null],
			documents: new FormArray([]),
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.remonteeForm.get('no_hab_required');
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
			let formData = new FormData();
			let form = {...this.remonteeForm.getRawValue()}
			
			for (let j = 0; j < this.uploader.queue.length; j++) {
				let fileItem = this.uploader.queue[j]._file;
				formData.append('documents[]', fileItem);
			}

			Object.keys(form).map(function (key) {
				if(form[key] && key != "documents")
				  return formData.append(key, form[key]);
			  })
		
			formData.set('event_date', this.dateFrToEnPipe.transform(form.event_date));
			
			this.remonteeService.update(this.remontee.id, formData)
				.toPromise()
				.then((remonte) => {
					this.formloading = false;
					this.cdr.markForCheck();

					Swal.fire({
						icon: 'success',
						title: this.translate.instant("REMONTEES.NOTIF.LIFT_UPDATED.TITLE"),
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
						title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
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


  controlDocuments(){
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
