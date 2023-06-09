import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { Subscription } from "rxjs";

import { ArService, ChantierService } from '@app/core/services';
import { Ar } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { tap, distinctUntilChanged } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-ar-edit',
  templateUrl: './ar-edit.component.html',
  styleUrls: ['./ar-edit.component.scss']
})
export class ArEditComponent implements OnInit, OnDestroy {
  
  	public ar: Ar;
	arForm: FormGroup;
  	formStatus = new FormStatus();
	formloading: boolean= false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
	// Private properties
	private subscriptions: Subscription[] = [];
	errors;

	/**
	 * Component constructor
	 *
	 * @param activatedRoute: ActivatedRoute
	 * @param router: Router
	 * @param arFB: FormBuilder
	 * @param layoutUtilsService: LayoutUtilsService
	 */
	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		private arService: ArService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		private translate: TranslateService,
		private location: Location,
		protected chantierService:ChantierService,
		protected dateFrToEnPipe:DateFrToEnPipe, 
		protected dateEnToFrPipe:DateEnToFrPipe,
		iconRegistry: MatIconRegistry, 
		sanitizer: DomSanitizer
	) {
		iconRegistry.addSvgIcon(
			'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
	 }

	ngOnInit() {
		this.createForm();
		this.setDynamicValidators();
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.arService
						.get(id)
						.pipe(
							tap(ar=>{
								var _ar = ar.result.data;
								_ar.date_accueil_secu = this.dateEnToFrPipe.transform(_ar.date_accueil_secu);
								_ar.date_validite = this.dateEnToFrPipe.transform(_ar.date_validite);
								this.arForm.patchValue(_ar);
								this.formPathValues(_ar);
							})
						).subscribe( async res => {
							this.ar = res.result.data;
							this.loaded = true;
							this.cdr.markForCheck();
						});
				} else {
					this.router.navigateByUrl('/analyses-risque/list');
				}
			}
		);
		this.subscriptions.push(routeSubscription);
	}

	formPathValues(ar: Ar){

		const riskformArray: FormArray = this.arForm.get('risques') as FormArray;
		ar.risques.forEach(element => {
			riskformArray.push(new FormControl(element.id));
		});

		const equipementFormArray: FormArray = this.arForm.get('equipements') as FormArray;
		ar.equipements.forEach(element => {
			equipementFormArray.push(new FormControl(element.id));
		});
		
		const zoneFormArray: FormArray = this.arForm.get('zones') as FormArray;
		ar.zones.forEach(element => {
			zoneFormArray.push(new FormControl(element.id));
		});

		const commentsFormArray: FormArray = this.arForm.get('comments') as FormArray;
		ar.cat_risques.forEach(element => {
			const commentGroup: FormGroup = this.arFB.group({
				'cat_risque_id': element.id,
				'commentaire': element.commentaire
			});
			commentsFormArray.push(commentGroup);
		});

		this.arForm.get('chantier_id').setValue(ar.chantier_id);
		this.arForm.get('a_prevoir_compagnons').setValue(ar.a_prevoir_compagnons+'');
		this.arForm.get('a_signer_registre_travaux').setValue(ar.a_signer_registre_travaux+'');
		this.arForm.get('a_prevoir_balisage').setValue(ar.a_prevoir_balisage+'');
	}

  	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	/**
	 * Redirect to list
	 *
	 */
	goBackWithId() {
		const url = `/analyses-risque/list`;
		this.router.navigateByUrl(url, { 
			relativeTo: this.activatedRoute 
		});
	}
  
  	createForm() {
		this.arForm = this.arFB.group({
			chantier_id: [null, Validators.required],
			a_prevoir_compagnons:['0', Validators.required],
			date_accueil_secu:[null],
			realisateur:[''],
			tel_realisateur:[''],
			date_validite:[null],
			accueil_secu_days:[null],
			accueil_secu_time_opening:[''],
			accueil_secu_time_closing:[''],

			contact_interne_secours:[null, Validators.required],
			tel_contact_interne_secours:['', Validators.required],
			contact_client_chef_chtr:['', Validators.required],
			tel_contact_client_chef_chtr:['', Validators.required],
			contact_client_hse:['', Validators.required],
			tel_contact_client_hse:['', Validators.required],
			heure_ouverture:['', Validators.required],
			heure_fermeture:['', Validators.required],
			courant_dispo:['', Validators.required],
		  
			a_signer_registre_travaux:['0', Validators.required],
			registre_signing_period:['quotidiennement'],
			nom_charge_registre:[null],
			adresse_charge_registre:[''],
			ville_charge_registre:[null],
			pays_charge_registre:[null],
			codepostal_charge_registre:[''],
			tel_charge_registre:[''],

			a_prevoir_balisage:['0', Validators.required],

			observations_signature:[''],
			risques:new FormArray([]),
			zones:new FormArray([]),
			equipements:new FormArray([]),
			comments:new FormArray([]),
		});
		this.loaded = true;
	}

	setDynamicValidators() {
		const nom_charge_registre = this.arForm.get('nom_charge_registre');
		const adresse_charge_registre = this.arForm.get('adresse_charge_registre');
		const ville_charge_registre = this.arForm.get('ville_charge_registre');
		const pays_charge_registre = this.arForm.get('pays_charge_registre');
		const codepostal_charge_registre = this.arForm.get('codepostal_charge_registre');
		const tel_charge_registre = this.arForm.get('tel_charge_registre');

		const date_accueil_secu = this.arForm.get('date_accueil_secu');
		const realisateur = this.arForm.get('realisateur');
		const tel_realisateur = this.arForm.get('tel_realisateur');
		const date_validite = this.arForm.get('date_validite');
		const accueil_secu_days = this.arForm.get('accueil_secu_days');
		const accueil_secu_time_opening = this.arForm.get('accueil_secu_time_opening');
		const accueil_secu_time_closing = this.arForm.get('accueil_secu_time_closing');

		var contactsFields = [];
		contactsFields[0] = [
		  {
			'name' : 'contact_interne_secours',
			'control' : this.arForm.get('contact_interne_secours')
		  },
		  {
			'name' : 'tel_contact_interne_secours',
			'control' : this.arForm.get('tel_contact_interne_secours')
		  }
		];
		contactsFields[1] = [
		  {
			'name' : 'contact_client_chef_chtr',
			'control' : this.arForm.get('contact_client_chef_chtr')
		  },
		  {
			'name' : 'tel_contact_client_chef_chtr',
			'control' : this.arForm.get('tel_contact_client_chef_chtr')
		  }
		];
		contactsFields[2] = [
		  {
			'name' : 'contact_client_hse',
			'control' : this.arForm.get('contact_client_hse')
		  },
		  {
			'name' : 'tel_contact_client_hse',
			'control' : this.arForm.get('tel_contact_client_hse')
		  }
		];
	
		contactsFields.forEach((item, index) => {
		  this.arForm.get(item[0].name).valueChanges
		  .pipe(distinctUntilChanged())  
		  .subscribe(field => {
	
			if (field !== '') {
			  contactsFields.forEach((element, key) => {
				if(key != index){
				  element.forEach(control => {
					control.control.setValidators(null);
				  });
				}
			  });
			}
	
			if (field === '') {
			  contactsFields.forEach((element, key) => {
				if(key != index){
				  element.forEach(control => {
					control.control.setValidators([Validators.required]);
				  });
				}
			  });
			}
	
			contactsFields.forEach((element, key) => {
			  if(key !== index){
				element.forEach(control => {
				  control.control.updateValueAndValidity();
				});
			  }
			});
		  });
		});
	
		this.arForm.get('a_signer_registre_travaux').valueChanges
		  .subscribe(a_signer_registre_travaux => {
	
			if (a_signer_registre_travaux === '1') {
			  nom_charge_registre.setValidators([Validators.required]);
			  adresse_charge_registre.setValidators([Validators.required]);
			  ville_charge_registre.setValidators([Validators.required]);
			  pays_charge_registre.setValidators([Validators.required]);
			  codepostal_charge_registre.setValidators([Validators.required]);
			  tel_charge_registre.setValidators([Validators.required]);
			}
	
			if (a_signer_registre_travaux === '0') {
			  nom_charge_registre.clearValidators();
			  adresse_charge_registre.clearValidators();
			  ville_charge_registre.clearValidators();
			  pays_charge_registre.clearValidators();
			  codepostal_charge_registre.clearValidators();
			  tel_charge_registre.clearValidators();
			}
	
			nom_charge_registre.updateValueAndValidity();
			adresse_charge_registre.updateValueAndValidity();
			ville_charge_registre.updateValueAndValidity();
			pays_charge_registre.updateValueAndValidity();
			codepostal_charge_registre.updateValueAndValidity();
			tel_charge_registre.updateValueAndValidity();
		  });

		this.arForm.get('a_prevoir_compagnons').valueChanges
		  .subscribe(a_prevoir_compagnons => {
	
			if (a_prevoir_compagnons === '1') {
			  date_accueil_secu.setValidators([Validators.required]);
			  realisateur.setValidators([Validators.required]);
			  tel_realisateur.setValidators([Validators.required]);
			  date_validite.setValidators([Validators.required]);
			  accueil_secu_days.setValidators([Validators.required]);
			  accueil_secu_time_opening.setValidators([Validators.required]);
			  accueil_secu_time_closing.setValidators([Validators.required]);
			}
	
			if (a_prevoir_compagnons === '0') {
			  date_accueil_secu.clearValidators();
			  realisateur.clearValidators();
			  tel_realisateur.clearValidators();
			  date_validite.clearValidators();
			  accueil_secu_days.clearValidators();
			  accueil_secu_time_opening.clearValidators();
			  accueil_secu_time_closing.clearValidators();
			}
	
			date_accueil_secu.updateValueAndValidity();
			realisateur.updateValueAndValidity();
			tel_realisateur.updateValueAndValidity();
			date_validite.updateValueAndValidity();
			accueil_secu_days.updateValueAndValidity();
			accueil_secu_time_opening.updateValueAndValidity();
			accueil_secu_time_closing.updateValueAndValidity();
		  });
	}

  	/**
	 * Refresh user
	 *
	 * @param isNew: boolean
	 * @param id: number
	 */
	refreshAr(id) {
		let url = this.router.url;
		url = `/analyses-risque/edit/${id}`;
		this.router.navigateByUrl(url, { 
			relativeTo: this.activatedRoute 
		});
	}

	async onSubmit(event) {
		try {
			let form = {...this.arForm.getRawValue()};
			this.formStatus.onFormSubmitting();

			if(form.chantier_id)
			{
				
  				this.formloading=true;
				form.date_accueil_secu = this.dateFrToEnPipe.transform(form.date_accueil_secu);
				form.date_validite = this.dateFrToEnPipe.transform(form.date_validite);
				form.id = this.ar.id;
				
				this.arService.update(form)
					.toPromise()
					.then((ar) => {
						this.cdr.markForCheck();
						this.formloading=false;
						Swal.fire({
							icon: 'success',
							title: this.translate.instant("ARS.NOTIF.AR_UPDATED.TITLE"),
							showConfirmButton: false,
							timer: 2000
						}).then(() => {
							this.location.back();
						});
					})
					.catch(err => {
						this.formloading=false;
						Swal.fire({
							icon: 'error',
							title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
							showConfirmButton: false,
							timer: 2000
						});

						if(err.status === 422){
							var messages = extractErrorMessagesFromErrorResponse(err);
							this.formStatus.onFormSubmitResponse({success: false, messages: messages});
							this.cdr.markForCheck();
						}
				

					});

				this.cdr.markForCheck();

			}else{
				
				this.formloading = false;
				Swal.fire({
				icon: 'error',
				title: this.translate.instant("ARS.NOTIF.CHANTIER_UNSELECTED.TITLE"),
				showConfirmButton: false,
				timer: 2000
				});
			}

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
