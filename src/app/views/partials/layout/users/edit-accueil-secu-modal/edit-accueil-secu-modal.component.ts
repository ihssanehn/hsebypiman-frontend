import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Component({
  selector: 'tf-edit-accueil-secu-modal',
  templateUrl: './edit-accueil-secu-modal.component.html',
  styleUrls: ['./edit-accueil-secu-modal.component.scss']
})
export class EditAccueilSecuModalComponent implements OnInit {

  form: FormGroup;
	formloading: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private dateFrToEnPipe: DateFrToEnPipe,
    private dateEnToFrPipe: DateEnToFrPipe,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formloading = true;
		this.form = this.fb.group({
      date_realisation: [moment().format('DD/MM/YYYY'), Validators.required]
    });

		this.formloading = false;
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
    item.date_realisation = direction == 'FrToEn' ? this.dateFrToEnPipe.transform(item.date_realisation) : this.dateEnToFrPipe.transform(item.date_realisation);
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
