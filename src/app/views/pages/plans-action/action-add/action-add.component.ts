import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import * as moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { ActionService, TypeService } from '@app/core/services';
import { Action, Type } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-action-add',
  templateUrl: './action-add.component.html',
  styleUrls: ['./action-add.component.scss']
})
export class ActionAddComponent implements OnInit {
  
  action: Action;
  actionForm: FormGroup;
  formloading: boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  formStatus = new FormStatus();
  
  constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private actionFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private actionService: ActionService,
		private typeService: TypeService,
		private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private location: Location,
		private permissionsService : NgxPermissionsService,
    private translate:TranslateService,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.action = new Action();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.actionForm = this.actionFB.group({
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
      habilitations: this.actionFB.array([], Validators.required),
      entreprises: this.actionFB.array([]),
      errors:this.actionFB.array([]),
    });
		this.loaded = true;
  }

  setDynamicValidators(){
    const no_hab_required = this.actionForm.get('no_hab_required');
  }
  
  async onSubmit(){
    
    this.formloading=true;
    this.formStatus.onFormSubmitting();
    this.cdr.markForCheck();

    let form = {...this.actionForm.getRawValue()};
    
    this.parseActionDate(form, 'FrToEn');

    this.actionService.create(form)
      .toPromise()
      .then((res) => {
        
        this.cdr.markForCheck();
        var action = res.result.data;
        this.formloading=false;
        Swal.fire({
          icon: 'success',
          title: 'Action créé avec succès',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/actions/detail/' + action.id]);
        });
      })
      .catch(err =>{ 
        
        this.formloading=false;
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
  
  }
  
  parseActionDate(item, direction){
		item.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_demarrage) : this.dateEnToFrPipe.transform(item.date_demarrage);
		if(item.entreprises.length > 0){
			item.entreprises.forEach(x=>{
				x.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.date_demarrage) : this.dateEnToFrPipe.transform(x.pivot.date_demarrage);
			})
		}
  }
  
	onCancel() {
		this.location.back();
  }
  
}
