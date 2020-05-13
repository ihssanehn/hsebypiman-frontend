import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Type, Status, CatHabilitation, Entreprise } from '@app/core/models';
import { AuthService, User } from '@app/core/auth';
import { TypeService, StatusService, CatHabilitationService, EntrepriseService } from '@app/core/services';
import { first } from 'rxjs/operators';


@Component({
  selector: 'tf-entreprise-form',
  templateUrl: './entreprise-form.component.html',
  styleUrls: ['./entreprise-form.component.scss']
})
export class EntrepriseFormComponent implements OnInit {

  typesList: Type[];
  typesLoaded: boolean = false;

  @Input() entrepriseForm: FormGroup;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private fb: FormBuilder,
    private statusService:StatusService,
    private catHabilitationService:CatHabilitationService,
    private entrepriseService: EntrepriseService,
    private authService:AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  async getTypes(){
    this.typesLoaded = false;
    var res = await this.typeService.getAllFromModel('Entreprise').toPromise();
    if(res){
      this.typesList = res.result.data;
      this.typesLoaded = true;
    }
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  isFieldRequired(name){
    return !!this.entrepriseForm.controls[name].validator(name).hasOwnProperty('required');
  }

  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.entrepriseForm.controls[controlName];
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
