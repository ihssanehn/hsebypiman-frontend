import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
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
  public chantiersList : Paginate<Chantier>;
  public chantier : Chantier;
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
      date: [null, Validators.compose([])],
      a_prevoir_compagnons:['0', Validators.compose([])],
      date_accueil_secu:[null, Validators.compose([])],
      realisateur:['', Validators.compose([])],
      tel_realisateur:['', Validators.compose([])],
      date_validite:[null, Validators.compose([])],
      num_secours:['', Validators.compose([])],
      contact_interne_secours:[null, Validators.compose([])],
      tel_contact_interne_secours:['', Validators.compose([])],
      contact_client_chef_chtr:['', Validators.compose([])],
      tel_contact_client_chef_chtr:['', Validators.compose([])],
      contact_client_hse:['', Validators.compose([])],
      tel_contact_client_hse:['', Validators.compose([])],
      heure_ouverture:['', Validators.compose([])],
      heure_fermeture:['', Validators.compose([])],
      courant_dispo:['', Validators.compose([])],

      zone_part:[false, Validators.compose([])],
      parking_salarie:[false, Validators.compose([])],
      parking_spe_chtr:[false, Validators.compose([])],
      stat_arr:[false, Validators.compose([])],
      algeco_cvti:[false, Validators.compose([])],
      zone_ext_non_surv:[false, Validators.compose([])],
      zone_surv_balisee:[false, Validators.compose([])],
      prevoir_balisage_materiel:[false, Validators.compose([])],

      a_signer_registre_travaux:['0', Validators.compose([])],
      nom_charge_registre:[null, Validators.compose([])],
      adresse_charge_registre:['', Validators.compose([])],
      ville_charge_registre:[null, Validators.compose([])],
      codepostal_charge_registre:['', Validators.compose([])],
      tel_charge_registre:['', Validators.compose([])],
      a_prevoir_balisage:['0', Validators.compose([])],
      nom_ca_cvti:['', Validators.compose([])],
      tel_ca_cvti:['', Validators.compose([])],
      assistant_ca:['', Validators.compose([])],
      tel_assistant_ca:['', Validators.compose([])],

      observations:['', Validators.compose([])],
      signature: this.arFB.group({
        date:['', Validators.compose([])],
        personnel_id:['', Validators.compose([])],
        personnel_fullname:['', Validators.compose([])],
        societe:['', Validators.compose([])],
        signature:['', Validators.compose([])],
        commentaires:['', Validators.compose([])],
      }),

      risques:new FormArray([]),
      epis:new FormArray([]),
		});
		this.loaded = true;
		this.cdr.detectChanges();
  }
  
  searchForChantier(keyword: string){
    this.filter.keyword = keyword;
    console.log(keyword);
    this.getChantier();
    console.log(this.chantiersList);
    console.log(this.chantier);
  }

  async getChantier(){
    try {
      this.chantiersList = await this.chantierService.search(this.filter).toPromise();
      this.chantier = this.chantiersList.data[0];
      this.cdr.detectChanges();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async onSubmit(event){

    try {
      let result;

      let form = {...this.arForm.value};
      form.date = this.setDateFormat(form.date);
      form.date_accueil_secu = this.setDateFormat(form.date_accueil_secu);
      form.date_validite = this.setDateFormat(form.date_validite);
      form.signature.date = this.setDateFormat(form.signature.date);
      form.chantier_id = this.chantier.id;
  
      if(
        !form.date &&
        !form.a_prevoir_compagnons &&
        !form.date_accueil_secu &&
        !form.realisateur &&
        !form.tel_realisateur &&
        !form.date_validite &&
        !form.num_secours &&
        !form.contact_interne_secours &&
        !form.tel_contact_interne_secours &&
        !form.contact_client_chef_chtr &&
        !form.tel_contact_client_chef_chtr &&
        !form.contact_client_hse &&
        !form.tel_contact_client_hse &&
        !form.heure_ouverture &&
        !form.heure_fermeture && !form.courant_dispo
      ){
        form = null;
      }

      console.log(form);

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
            timer: 1500
          });

          if(err.status === 422)
            this.arForm = { ...err.error};
            this.errors = true;

        });
        
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  setDateFormat(date){
      return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  
  
}
