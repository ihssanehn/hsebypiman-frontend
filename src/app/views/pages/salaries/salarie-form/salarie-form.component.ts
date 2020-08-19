import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { Type } from '@app/core/models/type.model';
import { FonctionService } from '@app/core/services';

@Component({
  selector: 'tf-salarie-form',
  templateUrl: './salarie-form.component.html',
  styleUrls: ['./salarie-form.component.scss']
})
export class SalarieFormComponent implements OnInit {

  @Input() salarieForm: FormGroup;
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
    if(this.salarieForm && this.salarieForm.controls[controlName]){
      const control = this.salarieForm.controls[controlName]
      const { validator } = control
      if (validator) {
          const validation = validator(new FormControl())
          return validation !== null && validation.required === true
      }
    }
    return false
  }

  isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.salarieForm.controls[controlName];
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
