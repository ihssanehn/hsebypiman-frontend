import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { CommonModule } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { VisiteService, TypeService, ChantierService } from '@app/core/services';
import { Visite, Type, Chantier } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-visite-add',
  templateUrl: './visite-add.component.html',
  styleUrls: ['./visite-add.component.scss']
})
export class VisiteAddComponent implements OnInit {
  
  visite: Visite;
  visiteForm: FormGroup;
	// allRoles: Role[];
	loaded = false;
  editMode: boolean = false;
  chantier: Chantier;
  // Private properties
  errors;
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private visiteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private visiteService: VisiteService,
		private chantierService: ChantierService,
		private typeService: TypeService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.visite = new Visite();
    this.createForm();    
  }

  createForm() {
		this.visiteForm = this.visiteFB.group({
      'chantier_id': ['', Validators.required],
      'salarie_id': [''],
      'sous_traitant_id': [''],
      'societe_ee': [''],
      'redacteur_id': ['', Validators.required],
      'date_visite': ['', Validators.required],
      'is_validated_redacteur': ['', Validators.required],
      'is_validated_visite': ['', Validators.required],
      'validated_redacteur_at': ['', Validators.required],
      'validated_visite_at': ['', Validators.required],
      'presence_non_conformite': ['', Validators.required],
      'has_rectification_imm': ['', Validators.required],
      'avertissement': ['', Validators.required],
      'type_id': ['', Validators.required],
      'questions': [],
		});
		this.loaded = true;
		this.cdr.detectChanges();
  }
  
  onChantierSelected(chantierId: Number) {
    this.getChantier(chantierId);
  }

  async getChantier(chantierId){
    this.chantier = await this.chantierService.get(chantierId).toPromise();
    // this.visiteForm.setValue('chantier_id':this.chantier.id);
    // this.visiteForm.setValue('redacteur_id':this.chantier.charge_affaire_id);
  }

  async onSubmit(event){
    try {
      let result;

      let form = {...this.visiteForm.value};
      
  
			this.visiteService.create(form)
        .toPromise()
        .then((visite) => {
          this.errors = false; 
          this.cdr.markForCheck();
          
          Swal.fire({
            icon: 'success',
            title: 'Chantié créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/visites/list']);
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
            this.visiteForm = { ...err.error};
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
