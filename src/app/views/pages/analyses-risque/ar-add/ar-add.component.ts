import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgModel, FormControlName } from "@angular/forms";
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { ArService, TypeService, ChantierService } from '@app/core/services';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Paginate } from '@app/core/_base/layout/models/paginate.model';
import { Ar, Type, Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-ar-add',
  templateUrl: './ar-add.component.html',
  styleUrls: ['./ar-add.component.scss']
})
export class ArAddComponent implements OnInit {

  // Chantier search control
  searchControl: FormControl = new FormControl();
  
  ar: Ar;
  arForm: FormGroup;
  types: Type[];
  users: User[];
	// allRoles: Role[];
	loaded = false;
  editMode: boolean = false;
  filter = {
    keyword: "",
  }
  public chantier : Chantier;
  public chantiers : Array<Chantier>;
  filteredChantiers: Observable<Array<Chantier>>;
  // Private properties
  errors;
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private arFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private arService: ArService,
		private typeService: TypeService,
    private authService: AuthService,
    protected chantierService:ChantierService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    iconRegistry: MatIconRegistry, 
    sanitizer: DomSanitizer
  ) {

    iconRegistry.addSvgIcon(
      'search',sanitizer.bypassSecurityTrustResourceUrl('./assets/media/hse-svg/search.svg'));
   }

  ngOnInit() {
    this.ar = new Ar();
    this.createForm();
    this.setDynamicValidators();
    this.getTypes();
    this.getUsers();
    this.initFilteredChantiers();
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

  async getTypes(){
    var res = await this.typeService.getAllFromModel('Ar').toPromise();
    this.types = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  createForm() {
		this.arForm = this.arFB.group({
      a_prevoir_compagnons:['0', Validators.required],
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

  async onSubmit(event){

    try {
      let result;

      if(this.chantier)
      {

        let form = {...this.arForm.value};
        form.date_accueil_secu = this.setDateFormat(form.date_accueil_secu);
        form.date_validite = this.setDateFormat(form.date_validite);
        form.chantier_id = this.chantier.id;


        this.arService.create(form)
          .toPromise()
          .then((ar) => {
            console.log(ar);
            this.errors = false; 
            this.cdr.markForCheck();
            
            Swal.fire({
              icon: 'success',
              title: 'Analyse de risque créée avec succès',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigate(['/analyses-risque/list']);
            });
          })
          .catch(err =>{ 

            Swal.fire({
              icon: 'error',
              title: 'Echec! le formulaire est incomplet',
              showConfirmButton: false,
              timer: 2000
            });

            if(err.status === 422)
              this.arForm = { ...err.error};
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

  setDateFormat(date){
      return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  displayFn(chantier:Chantier): String {
    return chantier ? chantier.nom : '';
  }


  
  
}
