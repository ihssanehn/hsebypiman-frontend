import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { Type,  } from '@app/core/models';
import { TypeService, DocumentService } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-remontee-form',
  templateUrl: './remontee-form.component.html',
  styleUrls: ['./remontee-form.component.scss']
})
export class RemonteeFormComponent implements OnInit {

  typesList: Type[];
  typesLoaded: boolean = false;

  @Input() remonteeForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() uploader: FileUploader;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  constructor(
    private typeService:TypeService,
    private documentService:DocumentService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.getTypes();
    console.log(this.uploader)
  }

  async getTypes(){
    this.typesLoaded = false;
    var res = await this.typeService.getAllFromModel('Remontee').toPromise();
    if(res){
      this.typesList = res.result.data;
      this.typesLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.remonteeForm && this.remonteeForm.controls[controlName]){
      const control = this.remonteeForm.controls[controlName]
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
		const control = this.remonteeForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  
  submitForm(datas){
    // if(bool){
    //   this.onSubmit.emit(bool)
    // }
  }
  cancelForm(){
    this.onCancel.emit()
  }

  deleteDoc(item){
    Swal.fire({
      icon: 'warning',
      title: 'Vous allez supprimer ce document de façon définitive',
      html: '<p>Êtes-vous sûr de vouloir continuer ?</p>',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Confirmer'
    }).then(async response => {
      if (response.value) {
        this.documentService.delete(item.id).toPromise()
        .then((res) => {
          this.cdr.markForCheck();
          var docArray = this.remonteeForm.get('documents') as FormArray;
          docArray.removeAt(docArray.value.findIndex(x => x.id === item.id))
          Swal.fire({
            icon: 'success',
            title: 'Document supprimé avec succès',
            showConfirmButton: false,
            timer: 1500,
          })
       })
      }
    });
  }
  

  seeItem(item){
    return item.file.name
  }
}
