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
			// async params => {
			// 	const id = params.id;
			// 	if (id) {
			// 		this.actionService.get(id).pipe(
			// 			tap(res=>{
			// 				this.parseActionDate(res.result.data, 'EnToFr');
			// 				this.actionForm.patchValue(res.result.data);							
			// 				this.formPathValues(res.result.data);
			// 				this.actionForm.controls['entreprises'].patchValue(res.result.data.entreprises);
			// 			})
			// 		).subscribe( async res => {
			// 			this.action = res.result.data;
			// 			this.loaded = true;
			// 			this.cdr.markForCheck();
			// 		});

			// 	} else {
			// 		this.router.navigateByUrl('/actions/list');
			// 	}
			// }
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
		const url = `/actions/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.actionForm = this.actionFB.group({
			nom: ['', Validators.required],
			type_id: [null, Validators.required],
			adresse: ['', Validators.required],
			ville: ['', Validators.required],
			code_postal: ['', Validators.required],
			pays: ['', Validators.required],
			client: ['', Validators.required],
			contact: ['', Validators.required],
			montant: ['', Validators.required],
			date_demarrage: ['', Validators.required],
			charge_affaire_id: [null, Validators.required],
			status_id: [null, Validators.required],
			numero: ['', Validators.required],
			resp_chiffrage_id: [null, Validators.required],
			no_hab_required: [0, Validators.required],
			habilitations: this.actionFB.array([], Validators.required),
			entreprises: this.actionFB.array([])
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.actionForm.get('no_hab_required');
	}
  
	formPathValues(action){
		const habformArray: FormArray = this.actionForm.get('habilitations') as FormArray;
		if(action.no_hab_required){
			habformArray.setValidators(null);
			habformArray.disable();
		}else{
			action.habilitations.forEach(element => {
				habformArray.push(new FormControl(element.id));
			});
		}

		const ees: FormArray = this.actionForm.get('entreprises') as FormArray;
		action.entreprises.forEach(element =>{
			var entreprise = this.actionFB.group({
				type_code:[element.type.code, Validators],
				entreprise_id: [element.id, Validators.required],
				interimaire_id: [element.pivot.interimaire_id, Validators],
				chiffre_affaire: [element.pivot.chiffre_affaire, Validators],
				date_demarrage: [element.pivot.date_demarrage, Validators],
			});

			
			if(entreprise.get('type_code').value == 'SOUS_TRAITANT'){
				entreprise.get('interimaire_id').setValidators(null);
				entreprise.get('chiffre_affaire').setValidators(Validators.required);
			}else{
				
				entreprise.get('interimaire_id').setValidators(Validators.required);
				entreprise.get('chiffre_affaire').setValidators(null);
			}

			entreprise.get('type_code').valueChanges.subscribe(code=>{
				if(code == 'SOUS_TRAITANT'){
					entreprise.get('interimaire_id').setValidators(null);
					entreprise.get('chiffre_affaire').setValidators(Validators.required);
				}else{
					
					entreprise.get('interimaire_id').setValidators(Validators.required);
					entreprise.get('chiffre_affaire').setValidators(null);
				}
			})
			
			ees.push(entreprise)
		})
		
	}
	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshAction(id) {
		let url = this.router.url;
		url = `/actions/edit/${id}`;
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
		// if(form.status_id != this.action.status_id && this.action.status.code == 'ENCOURS' && !this.action.is_all_ars_archived){
		// 	this.fireBeforeSave(form)
		// }else{
		// 	this.saveForm(form)
		// }
	}

	parseActionDate(item, direction){
		item.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_demarrage) : this.dateEnToFrPipe.transform(item.date_demarrage);
		if(item.entreprises.length > 0){
			item.entreprises.forEach(x=>{
				x.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.date_demarrage) : this.dateEnToFrPipe.transform(x.pivot.date_demarrage);
			})
		}
	}

	cancel() {
		this.location.back();
	}
}
