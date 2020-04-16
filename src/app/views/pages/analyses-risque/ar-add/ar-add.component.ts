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
    this.getTypes();
    this.getUsers();
    this.initFilteredChantiers();
  }

  async initFilteredChantiers(){
    this.chantiers = await this.chantierService.getAll().toPromise();
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
    this.types = await this.typeService.getAllFromModel('Ar').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  createForm() {
		this.arForm = this.arFB.group({
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
  
  searchForChantier(){
    if(this.searchControl.value && this.searchControl.value.id){
      this.initFilteredChantiers();
      this.getChantier(this.searchControl.value.id);
    }
  }

  async getChantier(chantierId: Number){
    try {
      this.chantier = await this.chantierService.get(chantierId).toPromise();
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
        form.date = this.setDateFormat(form.date);
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
