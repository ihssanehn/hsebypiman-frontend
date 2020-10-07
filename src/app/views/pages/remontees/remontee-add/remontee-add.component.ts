import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';
import moment from 'moment';

import { TranslateService } from '@ngx-translate/core';
import { RemonteeService, TypeService } from '@app/core/services';
import { Remontee, Type } from '@app/core/models';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService, User } from '@app/core/auth';
import { MatSnackBar } from '@angular/material';
import Swal from 'sweetalert2';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";

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
    this.remontee = new Remontee();
    this.createForm();
    this.setDynamicValidators();
  }

  createForm() {
		this.remonteeForm = this.remonteFB.group({
      description: ['', Validators.required],
      type_id: [null, Validators.required],
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
      let formData = new FormData();
      let form = {...this.remonteeForm.getRawValue()};
      this.formStatus.onFormSubmitting();

      for (let j = 0; j < this.uploader.queue.length; j++) {
        let fileItem = this.uploader.queue[j]._file;
        formData.append('documents[]', fileItem);
      }

      formData.append('type_id', this.remonteeForm.get('type_id').value);
      formData.append('description', this.remonteeForm.get('description').value);
      
			this.remonteeService.create(formData)
        .toPromise()
        .then((res) => {
          this.formloading = false;
          this.errors = false; 
          this.cdr.markForCheck();
          var remontee = res.result.data;
          Swal.fire({
            icon: 'success',
            title: 'Remontée QHSE créée avec succès',
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
  
  controlDocuments(){
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if(fileItem.size > 10000000){
        alert("Each File should be less than 10 MB of size.");
        return true;
      }
    }
    return false;
  }

  
}
