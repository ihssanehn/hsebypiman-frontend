import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { ChantierService, TypeService } from '@app/core/services';
import { Chantier, Type } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';

@Component({
  selector: 'tf-chantier-add',
  templateUrl: './chantier-add.component.html',
  styleUrls: ['./chantier-add.component.scss']
})
export class ChantierAddComponent implements OnInit {
  
  chantier: Chantier;
  chantierForm: FormGroup;
  types: Type[];
  users: User[];
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private chantierFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private chantierService: ChantierService,
		private typeService: TypeService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
		private translate:TranslateService,
  ) { }

  ngOnInit() {
    this.chantier = new Chantier();
    this.createForm();
    this.getTypes();
    this.getUsers();
    
  }

  async getTypes(){
    this.types = await this.typeService.getAllFromModel('Chantier').toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    this.users = await this.authService.getAllUsers().toPromise();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
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
      ar: this.chantierFB.group({
        date: [null, Validators.compose([])],
        a_prevoir_compagnons:['', Validators.compose([])],
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
      })
		});
		this.loaded = true;
		this.cdr.detectChanges();
  }
  
  async onSubmit(event){
    try {
      let result;

      let form = {...this.chantierForm.value};
      form.date_demarrage = this.setDateFormat(form.date_demarrage)
      form.ar.date = this.setDateFormat(form.date);
      form.ar.date_accueil_secu = this.setDateFormat(form.ar.date_accueil_secu);
      form.ar.date_demarrage = this.setDateFormat(form.ar.date_demarrage);
      form.ar.date_validite = this.setDateFormat(form.ar.date_validite);
  

			this.chantierService.create(form)
        .toPromise()
        .then((chantier) => {
          this.errors = false; 
          this.cdr.markForCheck();
          this.router.navigateByUrl('./list');
        })
        .catch(err =>{
          if(err.status === 422)
            this.chantierForm = { ...err.error};
            this.errors = true;
        });
        
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
      throw error;
    }

  }

  setDateFormat(date){
    return moment(date).format('YYYY-MM-DD');
  }
}
