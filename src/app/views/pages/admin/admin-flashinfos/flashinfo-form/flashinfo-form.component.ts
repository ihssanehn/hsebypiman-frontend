import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Type } from '@app/core/models/type.model';
import { FonctionService, RoleService } from '@app/core/services';
import { Role } from '@app/core/auth';

@Component({
  selector: 'tf-flashinfo-form',
  templateUrl: './flashinfo-form.component.html',
  styleUrls: ['./flashinfo-form.component.scss']
})
export class FlashInfoFormComponent implements OnInit {

  @Input() flashinfoForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Output() onLoading = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  fonctions: Type[];
  fonctionsLoaded: boolean = false;
  rolesLoaded: boolean = false;
  roles: Role[];
  civilites = [
    'Mme', 'Mlle', 'M.'
  ]

  constructor(
    private fonctionService: FonctionService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.getFonctions();
    this.getRoles();
  }

  onChangeEditor(content) {
    if(content) {
      this.onLoading.emit(false);
      this.flashinfoForm.get('content').setValue(content);
    } else {
      this.onLoading.emit(true);
    }
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
  async getRoles(){
    this.rolesLoaded = false;
    var res = await this.roleService.getList().toPromise();
    if(res){
      this.roles = res.result.data;
      this.rolesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.flashinfoForm && this.flashinfoForm.controls[controlName]){
      const control = this.flashinfoForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.flashinfoForm.controls[controlName];
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

  onOnTopCheckChange(event){
    const on_top = this.flashinfoForm.get('on_top') as FormControl;
    if(event.checked){
      on_top.setValue(1);
    }else{
      on_top.setValue(0);
    }
  }
  onVisibleCheckChange(event){
    const is_virtual = this.flashinfoForm.get('is_visible') as FormControl;
    if(event.checked){
      is_virtual.setValue(1);
    }else{
      is_virtual.setValue(0);
    }
  }


}
