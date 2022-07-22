import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { Habilitation } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { ActionService, FormationService, HabilitationService, TypeService } from '@app/core/services';
import { Action } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-habilitation-add',
  templateUrl: './habilitation-add.component.html',
  styleUrls: ['./habilitation-add.component.scss']
})
export class HabilitationAddComponent implements OnInit {

  habilitation: Habilitation;
  habilitationForm: FormGroup;
  formloading: boolean = false;
	loaded: boolean = false;
	editMode: boolean = false;
  formStatus = new FormStatus();

  constructor(
		private router: Router,
		private fb: FormBuilder,
		private habilitationService: HabilitationService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private translate:TranslateService,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.habilitation = new Habilitation();
    this.createForm();
  }

  createForm() {
		this.habilitationForm = this.fb.group({
      libelle: ['', Validators.required],
      cat_hab_id: [null, Validators.required],
      duree_validite: [null],
      active: [1],
      errors: this.fb.array([]),
    });
		this.loaded = true;
  }

  async onSubmit(){
    this.formloading = true;
    this.formStatus.onFormSubmitting();
    this.cdr.markForCheck();
    let form = {...this.habilitationForm.getRawValue()};

    this.habilitationService.create(form)
      .toPromise()
      .then((res) => {
        this.cdr.markForCheck();
        var habilitation = res.result.data;
        this.formloading=false;
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("HABILITATIONS.NOTIF.FORMATION_CREATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/admin/habilitations/detail/' + habilitation.id]);
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
  
	onCancel() {
		this.location.back();
  }

}
