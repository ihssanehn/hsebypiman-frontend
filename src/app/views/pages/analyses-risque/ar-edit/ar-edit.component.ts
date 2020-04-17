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

	searchControl: FormControl = new FormControl();
	public chantier : Chantier;
	public chantiers : Array<Chantier>;
	filteredChantiers: Observable<Array<Chantier>>;

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
		const routeSubscription = this.activatedRoute.params.subscribe(
			async params => {
				const id = params.id;
				if (id) {
					this.arService
						.get(id)
						.pipe(
							tap(res=>{
								this.arForm.patchValue(res.result.data);
								this.formPathValues(res.result.data);
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
		this.initFilteredChantiers();
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

		this.arForm.get('chantier_id').setValue(ar.chantier_id);
		this.arForm.get('a_prevoir_compagnons').setValue(ar.a_prevoir_compagnons+'');
		this.arForm.get('a_signer_registre_travaux').setValue(ar.a_signer_registre_travaux+'');
		this.arForm.get('a_prevoir_balisage').setValue(ar.a_prevoir_balisage+'');

		this.getChantier(ar.chantier_id);
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
			date: [null, Validators.required],
			a_prevoir_compagnons:['0', Validators.required],
			date_accueil_secu:[null, Validators.required],
			realisateur:['', Validators.required],
			tel_realisateur:['', Validators.required],
			date_validite:[null, Validators.required],
			num_secours:['', Validators.required],
			contact_interne_secours:[null, Validators.required],
			tel_contact_interne_secours:['', Validators.required],
			contact_client_chef_chtr:['', Validators.required],
			tel_contact_client_chef_chtr:['', Validators.required],
			contact_client_hse:['', Validators.required],
			tel_contact_client_hse:['', Validators.required],
			heure_ouverture:['', Validators.required],
			heure_fermeture:['', Validators.required],
			courant_dispo:['', Validators.required],
	  
			zone_part:[false, Validators.required],
			parking_salarie:[false, Validators.required],
			parking_spe_chtr:[false, Validators.required],
			stat_arr:[false, Validators.required],
			algeco_cvti:[false, Validators.required],
			zone_ext_non_surv:[false, Validators.required],
			zone_surv_balisee:[false, Validators.required],
			prevoir_balisage_materiel:[false, Validators.required],
	  
			a_signer_registre_travaux:['0', Validators.required],
			nom_charge_registre:[null, Validators.required],
			adresse_charge_registre:['', Validators.required],
			ville_charge_registre:[null, Validators.required],
			pays_charge_registre:[null, Validators.required],
			codepostal_charge_registre:['', Validators.required],
			tel_charge_registre:['', Validators.required],
			a_prevoir_balisage:['0', Validators.required],
			nom_ca_cvti:['', Validators.required],
			tel_ca_cvti:['', Validators.required],
			assistant_ca:['', Validators.required],
			tel_assistant_ca:['', Validators.required],
			risques:new FormArray([]),
			epis:new FormArray([]),
		});
		this.loaded = true;
		this.cdr.detectChanges();
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
			let result;

			if(this.chantier)
			{

				let form = {...this.arForm.value};
				form.date = this.setDateFormat(form.date);
				form.date_accueil_secu = this.setDateFormat(form.date_accueil_secu);
				form.date_validite = this.setDateFormat(form.date_validite);
				form.chantier_id = this.chantier.id;
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
	  

	async initFilteredChantiers(){
		var res = await this.chantierService.getList().toPromise();
		this.chantiers = res.result.data;
		this.filteredChantiers = this.searchControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
	}
	
	private _filter(value: string): Array<Chantier> {
		const filterValue = value;
		return this.chantiers.filter(chantier => 
		this._normalizeValue(chantier.nom).includes(filterValue)
		);
	}
	
	private _normalizeValue(value: String): string {
		return value.toLowerCase().replace(/\s/g, '');
	}
	
	searchForChantier(){
		if(this.searchControl.value && this.searchControl.value.id){
			this.initFilteredChantiers();
			this.getChantier(this.searchControl.value.id);
		}
	}
	
	async getChantier(chantierId: Number){
		try {
			var res = await this.chantierService.get(chantierId).toPromise();
			this.chantier = res.result.data;
			this.cdr.detectChanges();
			this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
	}
	
	displayFn(chantier: Chantier): String {
		return chantier ? chantier.nom : '';
	}

  
}
