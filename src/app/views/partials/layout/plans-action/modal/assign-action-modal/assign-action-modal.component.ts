import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonnelService } from '@app/core/services';
import { SelectOptionModel } from '@app/core/_base/layout';
import { User } from '@app/core/auth';

@Component({
  selector: 'tf-assign-action-modal',
  templateUrl: './assign-action-modal.component.html',
  styleUrls: ['./assign-action-modal.component.scss']
})
export class AssignActionModalComponent implements OnInit{

  form: FormGroup;
	usersList: SelectOptionModel[] = [];
  usersLoaded: boolean = false;

  constructor(
    private userService: PersonnelService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.getUsers();
  }

	async getUsers(){
		this.usersLoaded = false;
		var res = await this.userService.getList().toPromise();
		if(res){
		  this.usersList = res.result.data.map(user=>new SelectOptionModel(user.id, user.fullname));
		  this.usersLoaded = true;
		}
		this.cdr.markForCheck();
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
