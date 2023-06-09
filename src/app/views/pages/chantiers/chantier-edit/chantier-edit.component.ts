import { Component,OnInit,OnDestroy,ChangeDetectorRef } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup,Validators,FormControl, FormArray } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap } from 'rxjs/operators';

import { Location } from '@angular/common';
import { ChantierService } from '@app/core/services';
import { Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubheaderService } from '@app/core/_base/layout/services/subheader.service';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'tf-chantier-edit',
	templateUrl: './chantier-edit.component.html',
	styleUrls: ['./chantier-edit.component.scss']
})

export class ChantierEditComponent implements OnInit, OnDestroy {

	chantierForm: FormGroup;
	chantier: Chantier;
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
	 * @param chantierFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private chantierFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private chantierService: ChantierService,
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
					this.chantierService.get(id).pipe(
						tap(res=>{
							this.parseChantierDate(res.result.data, 'EnToFr');
							this.chantierForm.patchValue(res.result.data);							
							this.formPathValues(res.result.data);
							this.chantierForm.controls['entreprises'].patchValue(res.result.data.entreprises);
						})
					).subscribe( async res => {
						this.chantier = res.result.data;
						this.loaded = true;
						this.cdr.markForCheck();
					});

				} else {
					this.router.navigateByUrl('/chantiers/list');
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
		const url = `/chantiers/list`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	createForm() {
		this.chantierForm = this.chantierFB.group({
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
      charge_affaire_2_id: [null],
			status_id: [null, Validators.required],
			numero: ['', Validators.required],
			resp_chiffrage_id: [null, Validators.required],
			no_hab_required: [0, Validators.required],
			habilitations: this.chantierFB.array([], Validators.required),
			entreprises: this.chantierFB.array([])
		});
	}

	setDynamicValidators(){
		const no_hab_required = this.chantierForm.get('no_hab_required');
	}
  
	formPathValues(chantier){
		const habformArray: FormArray = this.chantierForm.get('habilitations') as FormArray;
		if(chantier.no_hab_required){
			habformArray.setValidators(null);
			habformArray.disable();
		}else{
			chantier.habilitations.forEach(element => {
				habformArray.push(new FormControl(element.id));
			});
		}

		const ees: FormArray = this.chantierForm.get('entreprises') as FormArray;
		chantier.entreprises.forEach(element =>{
			var entreprise = this.chantierFB.group({
				type_code:[element.type.code, Validators],
				entreprise_id: [element.id, Validators.required],
				// interimaire_id: [element.pivot.interimaire_id, Validators],
				chiffre_affaire: [element.pivot.chiffre_affaire, Validators],
				date_demarrage: [element.pivot.date_demarrage, Validators],
				interimaires: this.chantierFB.array([])
			});
			
			const interimaires = entreprise.get('interimaires') as FormArray
			
			element.pivot.interimaires.forEach(interim=>{
				var _interimaire = this.chantierFB.group({
					interimaire_id: [interim.id, [Validators.required]],
					date_debut_mission: [interim.pivot.date_debut_mission, Validators],
					date_fin_mission: [interim.pivot.date_fin_mission, Validators]
				})
				interimaires.push(_interimaire);
			})
			
			if(entreprise.get('type_code').value == 'SOUS_TRAITANT'){
				// entreprise.get('interimaire_id').setValidators(null);
				entreprise.get('chiffre_affaire').setValidators(Validators.required);
				(entreprise.get('interimaires') as FormArray).clear();
			}else{
				// entreprise.get('interimaire_id').setValidators(Validators.required);
				entreprise.get('chiffre_affaire').setValidators(null);
			}

			entreprise.get('type_code').valueChanges.subscribe(code=>{
				if(code == 'SOUS_TRAITANT'){
					(entreprise.get('interimaires') as FormArray).clear();
					entreprise.get('entreprise_id').setValue(null);
					entreprise.get('chiffre_affaire').setValidators(Validators.required);
				}else{
					// entreprise.get('interimaire_id').setValidators(Validators.required);
					entreprise.get('entreprise_id').setValue(null);
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
	refreshChantier(id) {
		let url = this.router.url;
		url = `/chantiers/edit/${id}`;
		this.router.navigateByUrl(url, {
			relativeTo: this.activatedRoute
		});
	}

	fireBeforeSave(form){
		Swal.fire({
			icon: 'warning',
			title: this.translate.instant("CHANTIERS.NOTIF.SITE_CLOSE_CONFIRMATION.TITLE"),
			text: this.translate.instant("CHANTIERS.NOTIF.SITE_CLOSE_CONFIRMATION.SUBTITLE"),
			showConfirmButton: true,
			showCancelButton: true,
			cancelButtonText: this.translate.instant("ACTION.CANCEL"),
			confirmButtonText: this.translate.instant("CHANTIERS.ACTION.CLOSE_SITE"),
		}).then(async response => {
			if (response.value) {
				this.saveForm(form);
			}
		})
	}
	
	saveForm(form){
		
        this.formloading = true;
		this.parseChantierDate(form, 'FrToEn');
		form.id = this.chantier.id;
		this.chantierService.update(form)
			.toPromise()
			.then((res) => {
				
				this.formloading = false;
				var code = res.message.code as SweetAlertIcon;
				var message = res.message.content != 'done' ? '<b class="text-'+code+'">'+res.message.content+'</b>' : null; 
				Swal.fire({
					icon: code,
					title: this.translate.instant("CHANTIERS.NOTIF.SITE_UPDATED.TITLE"),
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
	}

	async onSubmit(event) {
		
		this.formStatus.onFormSubmitting();
		let form = {...this.chantierForm.getRawValue()};
		if(form.status_id != this.chantier.status_id && this.chantier.status.code == 'ENCOURS' && !this.chantier.is_all_ars_archived){
			this.fireBeforeSave(form)
		}else{
			this.saveForm(form)
		}
	}

	parseChantierDate(item, direction){
		item.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_demarrage) : this.dateEnToFrPipe.transform(item.date_demarrage);
		if(item.entreprises.length > 0){
			item.entreprises.forEach(x=>{
				x.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.date_demarrage) : this.dateEnToFrPipe.transform(x.pivot.date_demarrage);

				if(direction == 'FrToEn'){
					x.interimaires.forEach(y=>{
						y.date_debut_mission = this.dateFrToEnPipe.transform(y.date_debut_mission);
						y.date_fin_mission = this.dateFrToEnPipe.transform(y.date_fin_mission);
					})
				}else{
					x.pivot.interimaires.forEach(y=>{
						y.pivot.date_debut_mission = this.dateEnToFrPipe.transform(y.pivot.date_debut_mission);
						y.pivot.date_fin_mission = this.dateEnToFrPipe.transform(y.pivot.date_fin_mission);
					})

				}
			})
		}
	}

	cancel() {
		this.location.back();
	}
}
