import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";
import { Materiel } from '@app/core/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material';
import { MaterielService, PersonnelService } from '@app/core/services';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import moment from 'moment';
import { User } from '@app/core/auth';

@Component({
  selector: 'tf-assign-action-modal',
  templateUrl: './assign-action-modal.component.html',
  styleUrls: ['./assign-action-modal.component.scss']
})
export class AssignActionModalComponent implements OnInit{

  form: FormGroup;
	usersList: User[];
  usersLoaded: boolean = false;

  constructor(
    private userService: PersonnelService,
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

	async getUsers(){
		this.usersLoaded = false;
		var res = await this.userService.getList().toPromise();
		if(res){
		  this.usersList = res.result.data;
		  this.usersLoaded = true;
		}
		this.cdr.markForCheck();
	}

  save() {
    this.activeModal.close(this.form);
  }

  closeModal(){
    this.activeModal.close();
  }

  formHasValue(key){
    return this.form.get(key).value ? true : false;
  }

  clearValue(key){
    this.form.get(key).patchValue(null);
  }

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.form.controls[controlName];

		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }

  isFieldRequired(controlName) {
    if (this.form && this.form.controls[controlName]) {
      const control = this.form.controls[controlName]
      const { validator } = control
      if (validator) {
        const validation = validator(new FormControl())
        return validation !== null && validation.required === true
      } else {
        return false;
      }
    }
  }

}
