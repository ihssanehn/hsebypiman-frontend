import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { CauserieService } from '@app/core/services';
import { Causerie } from '@app/core/models';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-causerie-add',
  templateUrl: './causerie-add.component.html',
  styleUrls: ['./causerie-add.component.scss']
})
export class CauserieAddComponent implements OnInit {
  
  causerie: Causerie;
  causerieForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;
  
  constructor(
		private router: Router,
		private causerieFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private causerieService: CauserieService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe,
    private dateEnToFrPipe:DateEnToFrPipe
  ) { }

  ngOnInit() {
    this.causerie = new Causerie();
    this.createForm();
  }

  createForm() {
		this.causerieForm = this.causerieFB.group({
      libelle: ['', Validators.required],
      sujet: ['', [Validators.required]],
      organisateur_id: [null, Validators.required],
      date: ['', [Validators.required]],
      lieu: ['', [Validators.required]],
    });
		this.loaded = true;
  }

  async onSubmit(){
    try {
      let result;
      this.formloading = true;
      let form = {...this.causerieForm.getRawValue()};
			this.parseCauserieDate(form, 'FrToEn');

      this.formStatus.onFormSubmitting();
  
			this.causerieService.create(form)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var causerie = res.result.data;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("CAUSERIES.NOTIF.CAUSERIE_CREATED.TITLE"),
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/causeries/detail/' + causerie.id]);
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
  

	parseCauserieDate(item, direction){
		item.date = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date) : this.dateEnToFrPipe.transform(item.date);
	}
}
