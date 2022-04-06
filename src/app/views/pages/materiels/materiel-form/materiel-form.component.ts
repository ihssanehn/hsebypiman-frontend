import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { Categorie,  } from '@app/core/models';
import { CategorieService, } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';




@Component({
  selector: 'tf-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.scss']
})
export class MaterielFormComponent implements OnInit {

  categoriesList: Categorie[];
  categoriesLoaded: boolean = false;

  @Input() materielForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  
  constructor(
    private categorieService:CategorieService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getCategories();
  }

  async getCategories(){
    this.categoriesLoaded = false;
    var res = await this.categorieService.getAll({model:'Materiel', structure:'tree'}).toPromise();
    if(res){
      this.categoriesList = localStorage.getItem('user_connection') == 'sirh' ? res.result.data.filter(item => item.code != 'VEHICULE') : res.result.data;
      this.categoriesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.materielForm && this.materielForm.controls[controlName]){
      const control = this.materielForm.controls[controlName]
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
	 * @param validationCategorie: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationCategorie: string): boolean {
		const control = this.materielForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationCategorie) && (control.dirty || control.touched);
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

  categorieChanged(data){
    if(data != this.materielForm.get('categorie_id').value){
      this.materielForm.get('categorie_id').setValue(data);
    }
  }

  isChecked(controlName: string){
    return this.materielForm.get(controlName).value == '1';
  }

  updateToggleValue(event, controlName){
    if(event.checked){
      this.materielForm.controls[controlName].setValue('1');
    }else{
      this.materielForm.controls[controlName].setValue('0');
    }
  }
}
