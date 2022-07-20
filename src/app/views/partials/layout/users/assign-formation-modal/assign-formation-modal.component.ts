import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";
import { Document, Formation } from '@app/core/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material';
import { FormationService } from '@app/core/services';

@Component({
  selector: 'tf-assign-formation-modal',
  templateUrl: './assign-formation-modal.component.html',
  styleUrls: ['./assign-formation-modal.component.scss']
})
export class AssignFormationModalComponent implements OnInit{

  form: FormGroup;
  formations: Formation[];
	loaded = false;
  errors;

  constructor(
    private formationService: FormationService,
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadFormations();
  }

  createForm() {
		this.form = this.fb.group({
      formation_id: [null, null],
    });
		this.loaded = true;
  }

  async loadFormations(){
		var res = await this.formationService.getList().toPromise();
		this.formations = res.result.data;
    console.log(this.formations);

    this.cdr.markForCheck();
  }

  save(){
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


  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.form.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }

  seeItem(item){
    return item.file.name
  }

}
