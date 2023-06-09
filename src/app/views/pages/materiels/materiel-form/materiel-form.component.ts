import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Categorie, Type,  } from '@app/core/models';
import { CategorieService, TypeService, } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { FileUploader } from "ng2-file-upload";
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-materiel-form',
  templateUrl: './materiel-form.component.html',
  styleUrls: ['./materiel-form.component.scss']
})
export class MaterielFormComponent implements OnInit {

  categoriesList: Categorie[];
  criteriasList: Type[];
  categoriesLoaded: boolean = false;
  subcategoriesList: Type[];
  subcategoriesLoaded: boolean = false;
  displayExtraFields: boolean = false;
  criteriaLoaded: boolean = false;
  subcategoryDisplayed: boolean = false;
  itemsToHandle: string[] = ['EPI_TETE', 'EPI_BRUIT', 'EPI_RESP', 'EPI_GANTS', 'EPI_CHAUSS'];
  accept: string = '.png, .bmp, .jpeg, .jpg, .gif, .tif, .doc, .docx, .pdf';
  
  @Input() materielForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() uploader:FileUploader = null;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  
  constructor(
    private categorieService:CategorieService,
    private translate:TranslateService,
    private typeService: TypeService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getCategories();
    this.getCriterias();
    this.getSubcategories();
    this.setDynamicValidators();

    if(this.materielForm.get('size').value || this.materielForm.get('criteria_id').value) {
      this.displayExtraFields = true;
    }

    if(this.materielForm.get('subcategory_id').value) {
      this.subcategoryDisplayed = true;
    }
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

  setDynamicValidators(){
    this.materielForm.get('stock_disponible').valueChanges.subscribe(stock => {
      if (stock > 1){
        this.materielForm.get('numero_serie').disable();
      }else{
        this.materielForm.get('numero_serie').enable();

      }
      this.materielForm.get('numero_serie').updateValueAndValidity();
    })
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

  displaySubcategory(code: string) {
    this.subcategoryDisplayed = (code == 'EPI_CHAUSS');
  }

  itemsToHandleSelected(selected: any) {
    this.displaySubcategory(selected);

    if(!selected) {
      this.materielForm.get('size').setValue(null);
      this.materielForm.get('criteria_id').setValue(null);
      this.displayExtraFields = false;
    } else {
      this.getCriterias(selected);
      this.getSubcategories(selected);
      this.displayExtraFields = true;
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

  clearValue(key){
    this.materielForm.get(key).patchValue(null);
  }

  // DOCUMENTS

  controlDocuments(){
    for (let i = 0; i < this.uploader.queue.length; i++) {
      let fileItem = this.uploader.queue[i]._file;
      if(fileItem.size > 10000000){
        alert(this.translate.instant("REMONTEES.NOTIF.FILE_SIZE_ALERT.TITLE"));
        return true;
      }
    }
    return false;
  }
  
  seeItem(item){
    return item.file.name
  }
  
  onFileDrop(event){
    var extensions = this.accept.split(', .');
    extensions[0] = extensions[0].slice(1);
    console.log(extensions)

    for (let i = 0; i < event.length; i++) {
      
      const droppedFile = event[i];
      var name = droppedFile.name.split('.');
      var ext = name[name.length -1].toLowerCase();
      
      let error = false;

      if( extensions.indexOf(ext) == -1 ){
        error = true;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('UPLOAD.EXTENSION')+' '+droppedFile.name,
          showConfirmButton: false,
          timer: 1500
        });
      } else if (droppedFile.size > 4000000) {
        error = true;
        Swal.fire({
          icon: 'error',
          title: this.translate.instant('UPLOAD.SIZE')+' '+droppedFile.name,
          showConfirmButton: false,
          timer: 1500
        });
      }

      if(error == true){
        this.uploader.queue = this.uploader.queue.filter(x=>x.file.name != droppedFile.name);
      }
    }

  }
}
