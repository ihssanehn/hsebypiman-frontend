import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { ChantierService } from '@app/core/services';
import { Chantier } from '@app/core/models';
import { MatSnackBar } from '@angular/material';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-chantier-add',
  templateUrl: './chantier-add.component.html',
  styleUrls: ['./chantier-add.component.scss']
})
export class ChantierAddComponent implements OnInit {
  
  chantier: Chantier;
  chantierForm: FormGroup;
  formloading: boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  formStatus = new FormStatus();
  
  constructor(
		private router: Router,
		private chantierFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private chantierService: ChantierService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private translate:TranslateService,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe,
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
      charge_affaire_2_id: [null],
      resp_chiffrage_id: [null, Validators.required],
      no_hab_required: [0, Validators.required],
      habilitations: this.chantierFB.array([], Validators.required),
      entreprises: this.chantierFB.array([]),
      errors:this.chantierFB.array([]),
    });
		this.loaded = true;
  }

  setDynamicValidators(){
    const no_hab_required = this.chantierForm.get('no_hab_required');
  }
  
  async onSubmit(){
    
    this.formloading=true;
    this.formStatus.onFormSubmitting();
    this.cdr.markForCheck();

    let form = {...this.chantierForm.getRawValue()};
    
    this.parseChantierDate(form, 'FrToEn');

    this.chantierService.create(form)
      .toPromise()
      .then((res) => {
        
        this.cdr.markForCheck();
        var chantier = res.result.data;
        this.formloading=false;
        Swal.fire({
          icon: 'success',
          title: this.translate.instant("CHANTIERS.NOTIF.SITE_CREATED.TITLE"),
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/chantiers/detail/' + chantier.id]);
        });
      })
      .catch(err =>{ 
        
        this.formloading=false;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant("NOTIF.INCOMPLETE_FORM.TITLE"),
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
  
  parseChantierDate(item, direction){
		item.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_demarrage) : this.dateEnToFrPipe.transform(item.date_demarrage);
		if(item.entreprises.length > 0){
			item.entreprises.forEach(x=>{
        x.date_demarrage = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(x.date_demarrage) : this.dateEnToFrPipe.transform(x.pivot.date_demarrage);
        x.interimaires.forEach(y=>{
          y.date_debut_mission = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(y.date_debut_mission) : this.dateEnToFrPipe.transform(y.pivot.date_debut_mission);
          y.date_fin_mission = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(y.date_fin_mission) : this.dateEnToFrPipe.transform(y.pivot.date_fin_mission);
        })
			})
		}
  }
  
	onCancel() {
		this.location.back();
  }
  
}
