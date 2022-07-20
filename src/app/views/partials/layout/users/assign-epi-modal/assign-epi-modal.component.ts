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
import { MaterielService } from '@app/core/services';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import moment from 'moment';

@Component({
  selector: 'tf-assign-epi-modal',
  templateUrl: './assign-epi-modal.component.html',
  styleUrls: ['./assign-epi-modal.component.scss']
})
export class AssignEpiModalComponent implements OnInit{

  editMode: boolean = false;
  pret: any;
  materiels: Materiel[];
  form: FormGroup;
	formloading: boolean = false;

  constructor(
    private materielService: MaterielService,
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe,
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadMateriels();
  }

  createForm() {
    this.formloading = true;
		this.form = this.fb.group({
      materiel_id: [null, Validators.required],
      date_pret: [moment().format('DD/MM/YYYY'), Validators.required],
      date_retour: [null, null],
    });

    if(this.editMode) {
      this.initForm();
    }

		this.formloading = false;
    this.cdr.markForCheck();
  }

  initForm() {
    var pret = this.pret;
    if (!pret.date_retour) {
      pret.date_retour = moment().format()
    }
    this.formatDates(pret, 'EnToFr');
    this.form.patchValue(pret);

    this.form.get('materiel_id').disable();
  }

  async loadMateriels(){
		var res = await this.materielService.getAllList({'categorie_code':'EPI', 'only_disponible': true}).toPromise();
		this.materiels = res.result.data;
    this.cdr.markForCheck();
  }

  save() {
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
    item.date_pret = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_pret) : this.dateEnToFrPipe.transform(item.date_pret);
    item.date_retour = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_retour) : this.dateEnToFrPipe.transform(item.date_retour);
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

  seeItem(item){
    return item.file.name
  }

}
