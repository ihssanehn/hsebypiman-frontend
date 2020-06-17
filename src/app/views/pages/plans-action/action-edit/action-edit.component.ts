import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject,Observable,of ,Subscription } from "rxjs";
import { finalize, takeUntil, tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { ActionService,TypeService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Action } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import * as moment from 'moment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
	selector: 'tf-action-edit',
	templateUrl: './action-edit.component.html',
	styleUrls: ['./action-edit.component.scss']
})

export class ActionEditComponent implements OnInit, OnDestroy {

	actionForm: FormGroup;
	action: Action;
  	formStatus = new FormStatus();
	formloading: boolean = false;
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
	 * @param actionFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private actionFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private actionService: ActionService,
		private cdr: ChangeDetectorRef,
		private permissionsService: NgxPermissionsService,
		private location: Location,
		private dateFrToEnPipe:DateFrToEnPipe,
		private dateEnToFrPipe:DateEnToFrPipe,
		private subheaderService:SubheaderService,
	) {	}
	
	ngOnInit() {
		this.createForm();
    	this.setDynamicValidators();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.actionService.get(id).pipe(
						tap(res=>{
							this.parseActionDate(res.result.data, 'EnToFr');
							this.actionForm.patchValue(res.result.data);							
						})
					).subscribe( async res => {
						this.action = res.result.data;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/plans-action/list');
				}
			}
		);
		this.subscriptions.push(routeSubscription);
  	}
    
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	goBackWithId() {
		const url = `/plans-action/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.actionForm = this.actionFB.group({
			type_id: [null, Validators.required],
			libelle: ['', Validators.required],
			risque: [''],
			objectif: ['', Validators.required],
			pilote_id: [''],
			delai: [''],
			realisation: [''],
			efficacite: [''],
			commentaires: [''],
			status_id: [null],
			visite_type: [null],
			actionable_id: [null],
			actionable_type: [null],
			actionable: [null],
			type: [null],
		});
	}

	setDynamicValidators(){
	}
  

	refreshAction(id) {
		let url = this.router.url;
		url = `/plans-action/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	fireBeforeSave(form){
		Swal.fire({
			icon: 'warning',
			title: 'Voulez vous vraiment clore ce action ?',
			text:'Les analyses de risque et visites de action seront archivés.',
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Clore le action'
		}).then(async response => {
			if (response.value) {
				this.saveForm(form);
			}
		})
	}
	
	saveForm(form){
		
        this.formloading = true;
		this.parseActionDate(form, 'FrToEn');
		form.id = this.action.id;

		this.actionService.update(form)
			.toPromise()
			.then((res) => {
				
				this.formloading = false;
				var code = res.message.code as SweetAlertIcon;
				var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				Swal.fire({
					icon: code,
					title: 'Action mis à jour avec succès',
					showConfirmButton: false,
					html: message,
					timer: code == 'success' ? 1500 : 3000
				}).then(() => {
					this.location.back();
				})
				this.cdr.markForCheck();
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
	}

	async onSubmit(event) {

		this.formStatus.onFormSubmitting();

		let form = {...this.actionForm.getRawValue()};
		form.actionable_id = form.actionable ? form.actionable.id : null;
    	form.actionable_type = form.visite_type ? form.visite_type.key : null; 

		if(form.status_id != this.action.status_id && this.action.status.code == 'ENCOURS'){
			this.fireBeforeSave(form)
		}else{
			this.saveForm(form)
		}
	}

	parseActionDate(item, direction){
		item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
		item.realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.realisation) : this.dateEnToFrPipe.transform(item.realisation);
	}

	cancel() {
		this.location.back();
	}
}
