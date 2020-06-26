import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Type,  } from '@app/core/models';
import { TypeService, } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';


@Component({
  selector: 'tf-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.scss']
})
export class MaterielFormComponent implements OnInit {

  typesList: Type[];
  typesLoaded: boolean = false;

  @Input() materielForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  async getTypes(){
    this.typesLoaded = false;
    var res = await this.typeService.getAllFromModel('Materiel').toPromise();
    if(res){
      this.typesList = res.result.data;
      this.typesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.materielForm && this.materielForm.controls[controlName]){
      const control = this.materielForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.materielForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  
  submitForm(bool){
    if(bool){
      this.onSubmit.emit(bool)
    }
  }
  cancelForm(){
    this.onCancel.emit()
  }

}
