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
      type_id: [null, Validators.required],
      libelle: ['', Validators.required],
      risque: ['', Validators.required],
      objectif: ['', Validators.required],
      pilote_id: ['', Validators.required],
      delai: ['', Validators.required],
      realisation: ['', Validators.required],
      efficacite: ['', Validators.required],
      commentaires: ['', Validators.required],
      status_id: [null],
      visite_type: [null],
      actionable_id: [null],
      visite: [null],
      errors: this.actionFB.array([]),
    });
		this.loaded = true;
  }

  setDynamicValidators(){
  }
  
  async onSubmit(){
    
    this.formloading = true;
    this.formStatus.onFormSubmitting();
    this.cdr.markForCheck();

    let form = {...this.actionForm.getRawValue()};
    form.actionable_id = form.visite ? form.visite.id : null; 
    
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
          this.router.navigate(['/plans-action/detail/' + action.id]);
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
    item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
    item.realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.realisation) : this.dateEnToFrPipe.transform(item.realisation);
  }
  
	onCancel() {
		this.location.back();
  }
  
}
