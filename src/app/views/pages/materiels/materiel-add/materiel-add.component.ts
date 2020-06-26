import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { MaterielService, TypeService } from '@app/core/services';
import { Materiel, Type } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-materiel-add',
  templateUrl: './materiel-add.component.html',
  styleUrls: ['./materiel-add.component.scss']
})
export class MaterielAddComponent implements OnInit {
  
  materiel: Materiel;
  materielForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private materielFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private materielService: MaterielService,
		private typeService: TypeService,
		private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private location: Location,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.materiel = new Materiel();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.materielForm = this.materielFB.group({
      raison_sociale: ['', Validators.required],
      type_id: [null, Validators.required],
      adresse: ['', [Validators]],
      ville: ['', [Validators]],
      code_postal: ['', [Validators]],
      pays: ['', [Validators]]
    });
		this.loaded = true;
  }

  setDynamicValidators(){
    const no_hab_required = this.materielForm.get('no_hab_required');
  }
  
  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.materielForm.getRawValue()};
      this.formStatus.onFormSubmitting();
  
			this.materielService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var materiel = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Materiel créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/materiels/detail/' + materiel.id]);
          });
        })
        .catch(err =>{ 
          this.formloading = false;

          Swal.fire({
            icon: 'error',
            title: 'Echec! le formulaire est incomplet',
            showConfirmButton: false,
            timer: 1500
          });

          if(err.status === 422){
            var messages = extractErrorMessagesFromErrorResponse(err);
            this.formStatus.onFormSubmitResponse({success: false, messages: messages});
            this.cdr.markForCheck();
          }

        });
        
      this.cdr.markForCheck();
    } catch (error) {
      this.formloading = false;
      console.error(error);
      throw error;
    }

  }
  
	onCancel() {
		this.location.back();
  }
  
}
