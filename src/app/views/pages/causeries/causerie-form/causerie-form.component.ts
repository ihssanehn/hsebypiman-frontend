import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService, } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { User } from '@app/core/auth';


@Component({
  selector: 'tf-causerie-form',
  templateUrl: './causerie-form.component.html',
  styleUrls: ['./causerie-form.component.scss']
})
export class CauserieFormComponent implements OnInit {

  usersList: User[];
  usersLoaded: boolean = false;

  @Input() causerieForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  constructor(
    private userService:UserService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers(){
    this.usersLoaded = false;
    var res = await this.userService.getList().toPromise();
    if(res){
      this.usersList = res.result.data;
      this.usersLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.causerieForm && this.causerieForm.controls[controlName]){
      const control = this.causerieForm.controls[controlName]
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
		const control = this.causerieForm.controls[controlName];
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
