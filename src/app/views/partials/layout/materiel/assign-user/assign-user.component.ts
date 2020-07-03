import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/core/services';
import { Type, Materiel } from '@app/core/models';

@Component({
  selector: 'tf-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss']
})
export class AssignUserComponent implements OnInit {

  form: FormGroup;

  @Output() onUserSelected = new EventEmitter<any>();
  salaries: any;
  assigning: boolean = false;
  
  constructor(
    private salarieService : UserService,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.form = this.fb.group({
      salarie_id: [null, Validators.required]
    })

    this.salaries = (await this.salarieService.getList().toPromise()).result.data;
    this.cdr.detectChanges();
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

  submitForm(){
    this.onUserSelected.emit(this.form.get('salarie_id').value);
  }

  clearValue(key){
    this.form.get(key).patchValue(null);
  }

  cancelAssigning(){
    this.form.get('salarie_id').patchValue(null);
    this.assigning = false;
  }

}
