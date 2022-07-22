import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CatHabilitation } from '@app/core/models';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-habilitation-form',
  templateUrl: './habilitation-form.component.html',
  styleUrls: ['./habilitation-form.component.scss']
})
export class HabilitationFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() formloading: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  catHabilitations: CatHabilitation[];
  catHabLoaded: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private catHabilitationService: CatHabilitationService
  ) { }

  ngOnInit() {
    this.getCatHabilitations();
  }

  async getCatHabilitations(){
    this.catHabLoaded = false;
    var res = await this.catHabilitationService.getAll().toPromise();
    if(res){
      this.catHabilitations = res.result.data;
      this.catHabLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.form && this.form.controls[controlName]){
      const control = this.form.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.form.controls[controlName];
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

  toggleCheck(target){
    var _value = (!this.form.get(target).value || this.form.get(target).value == 0) ? 1 : 0;
    console.log(_value);
    this.form.get(target).setValue(_value)
  }

  onCheckChange(event, target){
    var _value = event.checked ? 1 : 0;
    this.form.get(target).setValue(_value)
  }

}
