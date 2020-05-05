import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
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
    private location: Location,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.chantier = new Chantier();
    this.createForm();
    this.setDynamicValidators();
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
      resp_chiffrage_id: [null, Validators.required],
      no_hab_required: [0, Validators.required],
      habilitations: this.chantierFB.array([], Validators.required),
      entreprises: this.chantierFB.array([])
    });
		this.loaded = true;
		this.cdr.detectChanges();
  }

  setDynamicValidators(){
    const no_hab_required = this.chantierForm.get('no_hab_required');
  }
  
  async onSubmit(){
    try {
      let result;
      let form = {...this.chantierForm.value};
      form.date_demarrage = this.setDateFormat(form.date_demarrage)
      if(form.entreprises.length > 0){
        form.entreprises.forEach(x=>{
          x.date_demarrage = this.setDateFormat(x.date_demarrage);
        })
      }
  
			this.chantierService.create(form)
        .toPromise()
        .then((res) => {
          this.errors = false; 
          this.cdr.markForCheck();
          var chantier = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Chantier créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/chantiers/detail/' + chantier.id]);
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
            this.chantierForm = { ...err.error};
            this.errors = true;

        });
        
      this.cdr.markForCheck();
    } catch (error) {
        console.error(error);
      throw error;
    }

  }
  
	onCancel() {
		this.location.back();
  }
  
  setDateFormat(date){
      return date ? moment(date).format('YYYY-MM-DD') : null;
  }
  
}
