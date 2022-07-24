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
import moment from 'moment';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';

@Component({
  selector: 'tf-assign-formation-modal',
  templateUrl: './assign-formation-modal.component.html',
  styleUrls: ['./assign-formation-modal.component.scss']
})
export class AssignFormationModalComponent implements OnInit{

  form: FormGroup;
  formations: Formation[];
  errors;
	formloading: boolean = false;

  constructor(
    private formationService: FormationService,
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadFormations();
  }

  createForm() {
    this.formloading = true;
		this.form = this.fb.group({
      formation_id: [null, Validators.required],
      date_validite: [moment().format('DD/MM/YYYY'), Validators.required]
    });
		this.formloading = false;
  }

  async loadFormations(){
		var res = await this.formationService.getList().toPromise();
		this.formations = res.result.data;
    console.log(this.formations);

    this.cdr.markForCheck();
  }

  save(){
    this.formloading = true
    var form = { ...this.form.getRawValue() };
    this.formatDates(form, 'FrToEn');
    this.activeModal.close(form);
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

  formatDates(item, direction) {
    item.date_validite = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_validite) : this.dateEnToFrPipe.transform(item.date_validite);
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
