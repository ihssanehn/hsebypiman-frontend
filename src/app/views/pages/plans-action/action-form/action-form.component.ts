import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Type, Status, CatHabilitation, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService, CatHabilitationService, EntrepriseService, UserService } from '@app/core/services';
import { first } from 'rxjs/operators';
import { FormStatus } from '@app/core/_base/crud/models/form-status';


@Component({
  selector: 'tf-action-form',
  templateUrl: './action-form.component.html',
  styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent implements OnInit {

  @Input() actionForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() formloading: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  typesList: Type[];
  typesLoaded: boolean = false;
  usersList: User[];
  usersLoaded: boolean = false;
  statusList: Status[];
  statusLoaded: boolean = false;


  constructor(
    private typeService:TypeService,
    private statusService:StatusService,
    private userService:UserService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getUsers();
    this.getStatus();
  }

  async getTypes(){
    this.typesLoaded = false;
    var res = await this.typeService.getAllFromModel('Action').toPromise();
    if(res){
      this.typesList = res.result.data;
      this.typesLoaded = true;
    }
    this.cdr.markForCheck();
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

  async getStatus(){
    this.statusLoaded = false;
    var res = await this.statusService.getAllFromModel('Action').toPromise();
    if(res){
      this.statusList = res.result.data;
      this.statusLoaded = true;
    }
    this.cdr.markForCheck();
  }
  
  isFieldRequired(controlName){
    if(this.actionForm && this.actionForm.controls[controlName]){
      const control = this.actionForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.actionForm.controls[controlName];
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
