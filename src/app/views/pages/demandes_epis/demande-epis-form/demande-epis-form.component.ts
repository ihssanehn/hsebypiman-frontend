import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Type, Categorie,  } from '@app/core/models';
import { TypeService, DocumentService, CategorieService } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-demande-epis-form',
  templateUrl: './demande-epis-form.component.html',
  styleUrls: ['./demande-epis-form.component.scss']
})
export class DemandeEpisFormComponent implements OnInit {

  categoriesList: Categorie[];
  categoriesLoaded: boolean = false;
  subcategoryDisplayed: boolean = false;
  displayExtraFields: boolean = false;
  criteriaLoaded: boolean = false;
  criteriasList: Type[];
  itemsToHandle: string[] = ['EPI_TETE', 'EPI_BRUIT', 'EPI_RESP', 'EPI_GANTS', 'EPI_CHAUSS'];


  @Input() demandeEpisForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;

  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  constructor(
    private categorieService:CategorieService,
    private typeService:TypeService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getCategories();
  }


  async getCategories(){
    this.categoriesLoaded = false;
    var res = await this.categorieService.getAll({model:'Materiel', structure:'tree'}).toPromise();
    if(res){
      this.categoriesList = res.result.data.find(item=>item.code == 'EPI').children;
      this.categoriesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  categorieChanged(data, index){
    if(data != this.epis.at(index).get('categorie_id').value){
      this.epis.at(index).get('categorie_id').setValue(data);
    }
  }


  itemsToHandleSelected(selected: any) {
   
  }

  isFieldRequired(controlName){
    if(this.demandeEpisForm && this.demandeEpisForm.controls[controlName]){
      const control = this.demandeEpisForm.controls[controlName]
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
		const control = this.demandeEpisForm.controls[controlName];
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
  
  seeItem(item){
    return item.file.name
  }

  formHasValue(key){
    return this.demandeEpisForm.get(key).value ? true:false;
  }
  
  clearValue(key){
    this.demandeEpisForm.get(key).patchValue(null);
  }

  uploadSubmit() {
    
  }

	get epis(){
		return this.demandeEpisForm.get('epis') as FormArray;
	}

  removeEpi(i){
    return this.epis.removeAt(i);
  }
  addEpi(){
    return this.epis.push(this.formBuilder.group({
      categorie_id: [null, Validators.required],
      qte: [1, Validators.compose([Validators.required, Validators.min(1)])],
      comment: null,
    }))
  }
}
