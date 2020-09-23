import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { RemonteeService, TypeService } from '@app/core/services';
import { Remontee, Type } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-remontee-add',
  templateUrl: './remontee-add.component.html',
  styleUrls: ['./remontee-add.component.scss']
})
export class RemonteeAddComponent implements OnInit {
  
  remonte: Remontee;
  remonteForm: FormGroup;
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
		private remonteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private remonteeService: RemonteeService,
		private typeService: TypeService,
		private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private location: Location,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.remonte = new Remontee();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.remonteForm = this.remonteFB.group({
      description: ['', Validators.required],
      type_id: [null, Validators.required],
    });
		this.loaded = true;
  }

  setDynamicValidators(){
    const no_hab_required = this.remonteForm.get('no_hab_required');
  }
  
  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.remonteForm.getRawValue()};
      this.formStatus.onFormSubmitting();
  
			this.remonteeService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var remonte = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Remontée QHSE créé avec succès',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/remontees/detail/' + remonte.id]);
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
