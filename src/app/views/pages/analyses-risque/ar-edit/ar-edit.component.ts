import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";

import { ArService, TypeService, ChantierService } from '@app/core/services';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar, Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { tap, startWith, map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { JsonResponse } from '@app/core/_base/layout/models/jsonResponse.model';

@Component({
  selector: 'tf-ar-edit',
  templateUrl: './ar-edit.component.html',
  styleUrls: ['./ar-edit.component.scss']
})
export class ArEditComponent implements OnInit, OnDestroy {
  
  	public ar: Ar;
	arForm: FormGroup;
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
		private location: Location,
		protected chantierService:ChantierService,
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
								this.arForm.patchValue(ar.result.data);
								this.formPathValues(ar.result.data);
							})
						).subscribe( async res => {
							this.ar = res.result.data;
							this.loaded = true;
							this.cdr.detectChanges();
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

		const epiFormArray: FormArray = this.arForm.get('epis') as FormArray;
		ar.epi_types.forEach(element => {
			epiFormArray.push(new FormControl(element.id));
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
			a_prevoir_compagnons:[false, Validators.required],
			date_accueil_secu:[null, Validators.required],
			realisateur:['', Validators.required],
			tel_realisateur:['', Validators.required],
			date_validite:[null, Validators.required],
			accueil_secu_days:[null, Validators.required],
			accueil_secu_time_opening:['', Validators.required],
			accueil_secu_time_closing:['', Validators.required],
			num_secours:['', Validators.required],
			contact_interne_secours:[null, Validators.required],
			tel_contact_interne_secours:['', Validators.required],
			contact_client_chef_chtr:['', Validators.required],
			tel_contact_client_chef_chtr:['', Validators.required],
			contact_client_hse:['', Validators.required],
			tel_contact_client_hse:['', Validators.required],
			heure_ouverture:['07:00', Validators.required],
			heure_fermeture:['17:00', Validators.required],
			courant_dispo:['230V / 50Hz', Validators.required],
	  
			zone_part:[false, Validators.required],
			parking_salarie:[false, Validators.required],
			parking_spe_chtr:[false, Validators.required],
			stat_arr:[false, Validators.required],
			algeco_cvti:[false, Validators.required],
			zone_ext_non_surv:[false, Validators.required],
			zone_surv_balisee:[false, Validators.required],
			prevoir_balisage_materiel:[false, Validators.required],
	  
			a_signer_registre_travaux:['0', Validators.required],
			registre_signing_period:[null],
			nom_charge_registre:[null],
			adresse_charge_registre:[''],
			ville_charge_registre:[null],
			pays_charge_registre:[null],
			codepostal_charge_registre:[''],
			tel_charge_registre:[''],

			a_prevoir_balisage:['0', Validators.required],
			nom_ca_cvti:[''],
			tel_ca_cvti:[''],
			assistant_ca:[''],
			tel_assistant_ca:[''],
			risques:new FormArray([]),
			epis:new FormArray([]),
			comments:new FormArray([]),
		});
		this.loaded = true;
		this.cdr.detectChanges();
	}

	setDynamicValidators() {
		const nom_ca_cvti = this.arForm.get('nom_ca_cvti');
		const tel_ca_cvti = this.arForm.get('tel_ca_cvti');
		const assistant_ca = this.arForm.get('assistant_ca');
		const tel_assistant_ca = this.arForm.get('tel_assistant_ca');
	
		const nom_charge_registre = this.arForm.get('nom_charge_registre');
		const adresse_charge_registre = this.arForm.get('adresse_charge_registre');
		const ville_charge_registre = this.arForm.get('ville_charge_registre');
		const pays_charge_registre = this.arForm.get('pays_charge_registre');
		const codepostal_charge_registre = this.arForm.get('codepostal_charge_registre');
		const tel_charge_registre = this.arForm.get('tel_charge_registre');
	
		this.arForm.get('a_prevoir_balisage').valueChanges
		  .subscribe(a_prevoir_balisage => {
	
			if (a_prevoir_balisage === '1') {
			  nom_ca_cvti.setValidators([Validators.required]);
			  tel_ca_cvti.setValidators([Validators.required]);
			  assistant_ca.setValidators([Validators.required]);
			  tel_assistant_ca.setValidators([Validators.required]);
			}
	
			if (a_prevoir_balisage === '0') {
			  nom_ca_cvti.setValidators(null);
			  tel_ca_cvti.setValidators(null);
			  assistant_ca.setValidators(null);
			  tel_assistant_ca.setValidators(null);
			}
	
			nom_ca_cvti.updateValueAndValidity();
			tel_ca_cvti.updateValueAndValidity();
			assistant_ca.updateValueAndValidity();
			tel_assistant_ca.updateValueAndValidity();
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
			  nom_charge_registre.setValidators(null);
			  adresse_charge_registre.setValidators(null);
			  ville_charge_registre.setValidators(null);
			  pays_charge_registre.setValidators(null);
			  codepostal_charge_registre.setValidators(null);
			  tel_charge_registre.setValidators(null);
			}
	
			nom_charge_registre.updateValueAndValidity();
			adresse_charge_registre.updateValueAndValidity();
			ville_charge_registre.updateValueAndValidity();
			pays_charge_registre.updateValueAndValidity();
			codepostal_charge_registre.updateValueAndValidity();
			tel_charge_registre.updateValueAndValidity();
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
			let form = {...this.arForm.value};

			if(form.chantier_id)
			{
				form.date_accueil_secu = this.setDateFormat(form.date_accueil_secu);
				form.date_validite = this.setDateFormat(form.date_validite);
				form.id = this.ar.id;
				
				this.arService.update(form)
					.toPromise()
					.then((ar) => {
						this.errors = false;
						this.cdr.markForCheck();

						Swal.fire({
							icon: 'success',
							title: 'Analyse de risque mis à jour avec succès',
							showConfirmButton: false,
							timer: 2000
						}).then(() => {
							this.location.back();
						});
					})
					.catch(err => {

						Swal.fire({
							icon: 'error',
							title: 'Echec! le formulaire est incomplet',
							showConfirmButton: false,
							timer: 2000
						});

						if (err.status === 422)
							this.arForm = {
								...err.error
							};
						this.errors = true;

					});

				this.cdr.markForCheck();

			}else{
				Swal.fire({
				icon: 'error',
				title: 'Echec! Veuillez sélectionner un chantier',
				showConfirmButton: false,
				timer: 2000
				});
			}

		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	setDateFormat(date) {
		return date ? moment(date).format('YYYY-MM-DD') : null;
	}

	cancel() {
		this.location.back();
	}

}
