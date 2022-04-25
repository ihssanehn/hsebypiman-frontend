import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';
import { RemonteeService } from '@app/core/services';
import { Remontee } from '@app/core/models';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";
import { DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-remontee-add',
  templateUrl: './remontee-add.component.html',
  styleUrls: ['./remontee-add.component.scss']
})
export class RemonteeAddComponent implements OnInit {
  
  remontee: Remontee;
  remonteeForm: FormGroup;
  formStatus = new FormStatus();
  formloading: Boolean = false;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;


  public uploader:FileUploader = new FileUploader({
    isHTML5: true
  });

  
  constructor(
		private router: Router,
		private remonteFB: FormBuilder,
		// private notificationService: NzNotificationService,
		private remonteeService: RemonteeService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
    private dateFrToEnPipe:DateFrToEnPipe,
  ) { }

  ngOnInit() {
    this.remontee = new Remontee();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.remonteeForm = this.remonteFB.group({
      description: ['', Validators.required],
      type_id: [null, Validators.required],
      event_date: [new Date(), null],
      event_place: ['', null],
      event_type_id: [null, null],
      facts: ['', null],
      is_victims: [0, null],
      actions: ['', null],
      documentsToUpload: [null, null],
    });
		this.loaded = true;
  }

  setDynamicValidators(){
    const no_hab_required = this.remonteeForm.get('no_hab_required');
  }
  
  async onSubmit(){

    try {
      let result;
      this.formloading = true;
      this.formStatus.onFormSubmitting();
      let formData = new FormData();
      let form = {...this.remonteeForm.getRawValue()};
			
      for (let j = 0; j < this.uploader.queue.length; j++) {
        let fileItem = this.uploader.queue[j]._file;
        formData.append('documents[]', fileItem);
      }

      Object.keys(form).map(function (key) {
        if(form[key])
          return formData.append(key, form[key]);
      })

      formData.set('event_date', this.dateFrToEnPipe.transform(form.event_date));

			this.remonteeService.create(formData)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var remontee = res.result.data;
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("REMONTEES.NOTIF.LIFT_CREATED.TITLE"),
            showConfirmButton: false,
            timer: 1500,

    
          }).then(() => {
            this.uploader.clearQueue();
            this.router.navigate(['/remontees/list']);
          });
        })
        .catch(err =>{ 
          this.formloading = false;

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
  
  controlDocuments(){
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if(fileItem.size > 10000000){
        alert(this.translate.instant("REMONTEES.NOTIF.FILE_SIZE_ALERT.TITLE"));
        return true;
      }
    }
    return false;
  }

  
}
