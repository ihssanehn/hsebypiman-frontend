
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, FormControl } from '@angular/forms';
import { AuthService, User } from '@app/core/auth';
import { Type, Status, Entreprise } from '@app/core/models';
import { TypeService, StatusService, EntrepriseService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-vs-form-head',
  templateUrl: './vs-form-head.component.html',
  styleUrls: ['./vs-form-head.component.scss']
})
export class VsFormHeadComponent implements OnInit {

  types: Type[];
  users: User[];
  status: Status[];
  entreprises: Entreprise[];

  @Input() visiteForm: FormGroup;
  @Input() edit: Boolean;
  constructor(
    private typeService:TypeService,
    private statusService:StatusService,
    private authService:AuthService,
    private entrepriseService:EntrepriseService,
		private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    this.getUsers();
    this.getStatus();
    this.getEntreprises();
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel('Vs').toPromise();
    this.types = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getUsers(){
    var res = await this.authService.getList().toPromise();
    this.users = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getStatus(){
    var res = await this.statusService.getAllFromModel('Vs').toPromise();
    this.status = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }
  async getEntreprises(){
    var res = await this.entrepriseService.getList().toPromise();
    this.entreprises = res.result.data;
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.visiteForm && this.visiteForm.controls[controlName]){
      const control = this.visiteForm.controls[controlName]
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
		const control = this.visiteForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }

  
  formHasValue(key){
    return this.visiteForm.get(key).value ? true:false;
  }
  clearValue(key){
    this.visiteForm.get(key).patchValue(null);
  }
  
  isChecked(controlName: string){
    return this.visiteForm.get(controlName).value == '1';
  }

  updateToggleValue(event, controlName){
    if(event.checked){
      this.visiteForm.controls[controlName].setValue('1');
    }else{
      this.visiteForm.controls[controlName].setValue('0');
    }
  }
  
}
