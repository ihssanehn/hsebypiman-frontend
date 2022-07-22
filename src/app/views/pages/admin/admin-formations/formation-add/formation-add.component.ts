import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';
import { Formation } from '@app/core/models';
import { TranslateService } from '@ngx-translate/core';
import { ActionService, FormationService, TypeService } from '@app/core/services';
import { Action } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-formation-add',
  templateUrl: './formation-add.component.html',
  styleUrls: ['./formation-add.component.scss']
})
export class FormationAddComponent implements OnInit {

  formation: Formation;
  formationForm: FormGroup;
  formloading: boolean = false;
	loaded: boolean = false;
	editMode: boolean = false;
  formStatus = new FormStatus();

  constructor(
    private activatedRoute: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private formationService: FormationService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private translate:TranslateService,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.formation = new Formation();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.formationForm = this.fb.group({
      habilitation_id: [null],
      libelle: ['', Validators.required],
      description: [''],
      organisme_formation: [''],
      date_debut: [''],
      date_fin: [''],
      to_habilitation: [0],
      errors: this.fb.array([]),
    });
		this.loaded = true;
  }

  setDynamicValidators(){
  }

  async onSubmit(){
    
    this.formloading = true;
    this.formStatus.onFormSubmitting();
    this.cdr.markForCheck();

    let form = {...this.formationForm.getRawValue()};
    this.parseDate(form, 'FrToEn');

    this.formationService.create(form)
      .toPromise()
      .then((res) => {
        this.cdr.markForCheck();
        var formation = res.result.data;
        this.formloading=false;
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("FORMATIONS.NOTIF.FORMATION_CREATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/formations/detail/' + formation.id]);
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
  
  parseDate(item, direction){
    item.date_debut = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_debut) : this.dateEnToFrPipe.transform(item.date_debut);
    item.date_fin = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_fin) : this.dateEnToFrPipe.transform(item.date_fin);
  }
  
	onCancel() {
		this.location.back();
  }

}
