import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-close-action-modal',
  templateUrl: './close-action-modal.component.html',
  styleUrls: ['./close-action-modal.component.scss']
})
export class CloseActionModalComponent implements OnInit{

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
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
