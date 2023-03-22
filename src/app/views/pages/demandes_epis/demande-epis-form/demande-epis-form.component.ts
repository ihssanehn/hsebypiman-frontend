import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Type, Categorie,  } from '@app/core/models';
import { TypeService, DocumentService, CategorieService, BuService } from '@app/core/services';
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

  busList: any[];
  busLoaded: boolean = false;
  
  // subcategoryDisplayed: boolean = false;
  // displayExtraFields: boolean = false;
  
  criteriaLoaded: boolean = false;
  criteriasList: Type[];
  
  subcategoriesLoaded: boolean = false;
  subcategoriesList: Type[];
  
  itemsToHandle: string[] = ['EPI_TETE', 'EPI_BRUIT', 'EPI_RESP', 'EPI_GANTS', 'EPI_CHAUSS'];


  @Input() demandeEpisForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;

  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  constructor(
    private categorieService:CategorieService,
    private typeService:TypeService,
    private buService:BuService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.demandeEpisForm.get('bu_id').valueChanges.subscribe(value=>{
      if(value && this.getBuCode() == 'Autres'){
        this.demandeEpisForm.get('bu_autre').enable();
        this.demandeEpisForm.get('bu_autre').setValidators([Validators.required]);
      }else{
        this.demandeEpisForm.get('bu_autre').disable();
        this.demandeEpisForm.get('bu_autre').setValidators([]);
      }
    })
    this.getBus();
    this.getCategories();
    this.getCriterias();
    this.getSubcategories();
  }

  async getBus(){
    this.busLoaded = false;
    await this.buService.getList().toPromise().then(res=>{
      this.busList = res.result.data;
      this.busLoaded = true;
      this.cdr.markForCheck();
    })
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


  async getCriterias(EPI_code: string = null) {
    this.criteriaLoaded = false;
    var params;
    if(EPI_code) {
      params = {
        'model': 'CriteriaMateriel',
        'code': EPI_code
      }
    } else  {
      params = {
        'model': 'CriteriaMateriel'
      }
    }

    var res = await this.typeService.getAll(params).toPromise();
    if(res){
      this.criteriasList = res.result.data;
      this.criteriaLoaded = true;
    }
    this.cdr.markForCheck();
  }

  async getSubcategories(EPI_code: string = null) {
    this.subcategoriesLoaded = false;
    var params;
    if(EPI_code) {
      params = {
        'model': 'SubMateriel',
        'code': EPI_code
      }
    } else  {
      params = {
        'model': 'SubMateriel'
      }
    }

    var res = await this.typeService.getAll(params).toPromise();
    if(res){
      this.subcategoriesList = res.result.data;
      this.subcategoriesLoaded = true;
    }
    this.cdr.markForCheck();
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
			criteria_id: null,
			subcategory_id: null,
			size: null,
      displayExtraFields: false,
      displaySubcategory: false,
    }))
  }

  subcategoryDisplayed(i){
    let epi_cat_value = this.epis.at(i).get('categorie_id').value;
    let cat = epi_cat_value && this.categoriesList ? this.categoriesList.find(x=> x.id == this.epis.at(i).get('categorie_id').value) : null;
    return cat ? cat.code == 'EPI_CHAUSS' : false;
  }

  displayExtraFields(i){
    return false;
  }


  categorieChanged(data, index){
    if(data != this.epis.at(index).get('categorie_id').value){
      this.epis.at(index).get('categorie_id').setValue(data);
    }
  }

  displaySubcategory(code: string, i) {
    this.epis.at(i).get('displaySubcategory').setValue(code == 'EPI_CHAUSS');
    if(code != 'EPI_CHAUSS'){
      this.epis.at(i).get('subcategory_id').setValue(null);
    }
  }

  itemsToHandleSelected(selected: any, i) {
   this.displaySubcategory(selected, i);
    console.log(selected);
    if(!selected) {
      this.epis.at(i).get('size').setValue(null);
      this.epis.at(i).get('criteria_id').setValue(null);
      this.epis.at(i).get('displayExtraFields').setValue(false);
    } else {
      this.getCriterias(selected);
      this.getSubcategories(selected);
      this.epis.at(i).get('displayExtraFields').setValue(true);
    }
  }

  getBuCode(){
    let bu_id = this.demandeEpisForm.get('bu_id').value;
    return this.busList.find(x=>x.id == bu_id) ? this.busList.find(x=>x.id == bu_id).libelle : null;
  }

}
