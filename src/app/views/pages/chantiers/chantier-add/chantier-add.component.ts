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
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-chantier-add',
  templateUrl: './chantier-add.component.html',
  styleUrls: ['./chantier-add.component.scss']
})
export class ChantierAddComponent implements OnInit {
  
  chantier: Chantier;
  chantierForm: FormGroup;
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
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.chantier = new Chantier();
    this.createForm();    
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
        a_prevoir_compagnons:[null, Validators.compose([])],
        date_accueil_secu:[null, Validators.compose([])],
        realisateur:[null, Validators.compose([])],
        tel_realisateur:[null, Validators.compose([])],
        date_validite:[null, Validators.compose([])],
        num_secours:[null, Validators.compose([])],
        contact_interne_secours:[null, Validators.compose([])],
        tel_contact_interne_secours:[null, Validators.compose([])],
        contact_client_chef_chtr:[null, Validators.compose([])],
        tel_contact_client_chef_chtr:[null, Validators.compose([])],
        contact_client_hse:[null, Validators.compose([])],
        tel_contact_client_hse:[null, Validators.compose([])],
        heure_ouverture:[null, Validators.compose([])],
        heure_fermeture:[null, Validators.compose([])],
        courant_dispo:[null, Validators.compose([])],
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
      form.ar.date = this.setDateFormat(form.ar.date);
      form.ar.date_accueil_secu = this.setDateFormat(form.ar.date_accueil_secu);
      form.ar.date_demarrage = this.setDateFormat(form.ar.date_demarrage);
      form.ar.date_validite = this.setDateFormat(form.ar.date_validite);
  
      if(
        !form.ar.date &&
        !form.ar.a_prevoir_compagnons &&
        !form.ar.date_accueil_secu &&
        !form.ar.realisateur &&
        !form.ar.tel_realisateur &&
        !form.ar.date_validite &&
        !form.ar.num_secours &&
        !form.ar.contact_interne_secours &&
        !form.ar.tel_contact_interne_secours &&
        !form.ar.contact_client_chef_chtr &&
        !form.ar.tel_contact_client_chef_chtr &&
        !form.ar.contact_client_hse &&
        !form.ar.tel_contact_client_hse &&
        !form.ar.heure_ouverture &&
        !form.ar.heure_fermeture && !form.ar.courant_dispo
      ){
        form.ar = null;
      }

			this.chantierService.create(form)
        .toPromise()
        .then((chantier) => {
          this.errors = false; 
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Entité ajoutée avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/chantiers/list']);
          });
        })
        .catch(err =>{ 

          Swal.fire({
            icon: 'error',
            title: 'Echec! une erreur est survenue',
            showConfirmButton: false,
            timer: 1500
          });

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
      return date ? moment(date).format('YYYY-MM-DD') : null;
  }

  
}
