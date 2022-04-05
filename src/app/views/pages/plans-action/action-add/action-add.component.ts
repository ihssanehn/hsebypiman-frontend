import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import moment from 'moment';

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
      risque: [''],
      objectif: ['', Validators.required],
      pilote_id: [''],
      delai: [''],
      date_realisation: [''],
      efficacite: [''],
      commentaires: [''],
      status_id: [null],
      visite_type: [null],
      actionable_id: [null],
      actionable_type: [null],
      actionable: [null],
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
    form.actionable_id = form.actionable ? form.actionable.id : null;
    form.actionable_type = form.visite_type ? form.visite_type.key : null; 
    
    this.parseActionDate(form, 'FrToEn');

    this.actionService.create(form)
      .toPromise()
      .then((res) => {
        
        this.cdr.markForCheck();
        var action = res.result.data;
        this.formloading=false;
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("PLANACTIONS.NOTIF.ACTION_CREATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/plan-actions/detail/' + action.id]);
        });
      })
      .catch(err =>{ 
        
        this.formloading=false;
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
  
  }
  
  parseActionDate(item, direction){
    item.delai = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.delai) : this.dateEnToFrPipe.transform(item.delai);
    item.date_realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_realisation) : this.dateEnToFrPipe.transform(item.date_realisation);
  }
  
	onCancel() {
		this.location.back();
  }
  
}
