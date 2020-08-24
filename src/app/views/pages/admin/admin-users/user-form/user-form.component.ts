import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Type } from '@app/core/models/type.model';
import { FonctionService } from '@app/core/services';

@Component({
  selector: 'tf-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Input() userForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  fonctions: Type[];
  fonctionsLoaded: boolean = false;

  constructor(
    private fonctionService: FonctionService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getFonctions();
  }

  async getFonctions(){
    this.fonctionsLoaded = false;
    var res = await this.fonctionService.getList().toPromise();
    if(res){
      this.fonctions = res.result.data;
      this.fonctionsLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.userForm && this.userForm.controls[controlName]){
      const control = this.userForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.userForm.controls[controlName];
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
