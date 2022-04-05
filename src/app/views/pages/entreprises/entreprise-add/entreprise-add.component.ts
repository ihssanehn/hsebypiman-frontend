import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { EntrepriseService, TypeService } from '@app/core/services';
import { Entreprise, Type } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-entreprise-add',
  templateUrl: './entreprise-add.component.html',
  styleUrls: ['./entreprise-add.component.scss']
})
export class EntrepriseAddComponent implements OnInit {
  
  entreprise: Entreprise;
  entrepriseForm: FormGroup;
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
		private entrepriseFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private entrepriseService: EntrepriseService,
		private typeService: TypeService,
		private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private location: Location,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.entreprise = new Entreprise();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.entrepriseForm = this.entrepriseFB.group({
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
    const no_hab_required = this.entrepriseForm.get('no_hab_required');
  }
  
  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.entrepriseForm.getRawValue()};
      this.formStatus.onFormSubmitting();
  
			this.entrepriseService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var entreprise = res.result.data;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("EES.NOTIF.COMPANY_CREATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/entreprises/detail/' + entreprise.id]);
          });
        })
        .catch(err =>{ 
          this.formloading = false;

          Swal.fire({
            icon: 'error',
            title: this.translate.instant("ARS.NOTIF.INCOMPLETE_FORM.TITLE"),
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
