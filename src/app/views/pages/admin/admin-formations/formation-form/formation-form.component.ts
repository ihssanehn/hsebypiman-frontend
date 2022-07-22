import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HabilitationService } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';

@Component({
  selector: 'tf-formation-form',
  templateUrl: './formation-form.component.html',
  styleUrls: ['./formation-form.component.scss']
})
export class FormationFormComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() formloading: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  habilitations: any[];
  habLoaded: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private habilitationService: HabilitationService
  ) { }

  ngOnInit() {
    this.getHabilitations();
    this.setDynamicValidators();
  }

  async getHabilitations(){
    this.habLoaded = false;
    var res = await this.habilitationService.getAll().toPromise();
    if(res){
      this.habilitations = res.result.data;
      this.habLoaded = true;
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

  setDynamicValidators(){
    this.form.get('to_habilitation').valueChanges.subscribe(to_hab => {
      if (to_hab){
        this.form.get('habilitation_id').setValidators(Validators.required);
      }else{
        this.form.get('habilitation_id').setValidators(null);
      }
      this.form.get('habilitation_id').updateValueAndValidity();
    })
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
