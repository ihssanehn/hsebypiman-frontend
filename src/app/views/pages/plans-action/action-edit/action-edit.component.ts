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
import moment from 'moment';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';

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
		private translate: TranslateService,
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
					this.router.navigateByUrl('/plan-actions/list');
				}
			}
		);
		this.subscriptions.push(routeSubscription);
  	}
    
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	goBackWithId() {
		const url = `/plan-actions/list`;
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
			date_realisation: [''],
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
		url = `/plan-actions/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	fireBeforeSave(form){
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("PLANACTIONS.NOTIF.CLOSE_ACTION_CONFIRMATION.TITLE"),
			text: this.translate.instant("PLANACTIONS.NOTIF.CLOSE_ACTION_CONFIRMATION.LABEL"),
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("PLANACTIONS.ACTION.CLOSE_ACTION"),
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
					title: this.translate.instant("PLANACTIONS.NOTIF.ACTION_UPDATED.TITLE"),
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
	}

	async onSubmit(event) {

		this.formStatus.onFormSubmitting();

		let form = {...this.actionForm.getRawValue()};
		form.actionable_id = form.actionable ? form.actionable.id : null;
    	form.actionable_type = form.visite_type ? form.visite_type.key : form.actionable_type; 

		if(form.status_id != this.action.status_id && this.action.status.code == 'ENCOURS'){
			this.fireBeforeSave(form)
		}else{
			this.saveForm(form)
		}
	}

	parseActionDate(item, direction){
		item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
		item.date_realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_realisation) : this.dateEnToFrPipe.transform(item.date_realisation);
	}

	cancel() {
		this.location.back();
	}
}
