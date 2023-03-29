import { Component, OnInit, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { DocumentService, UserService, } from '@app/core/services';
import { FormStatus } from '@app/core/_base/crud/models/form-status';
import { User } from '@app/core/auth';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { SelectOptionModel } from '@app/core/_base/layout';


@Component({
  selector: 'tf-causerie-form',
  templateUrl: './causerie-form.component.html',
  styleUrls: ['./causerie-form.component.scss']
})
export class CauserieFormComponent implements OnInit {

  usersList: SelectOptionModel[] = [];
  usersLoaded: boolean = false;

  @Input() causerieForm: FormGroup;
  @Input() formStatus: FormStatus;
  @Input() edit: Boolean;
  @Input() uploader: FileUploader;
  @Output() onCancel = new EventEmitter();
  @Output() onSubmit = new EventEmitter();

  constructor(
    private userService: UserService,
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  async getUsers(){
    this.usersLoaded = false;
    var res = await this.userService.getList().toPromise();
    if(res){
      this.usersList = res.result.data.map(user=> new SelectOptionModel(user.id, user.fullname));
      this.usersLoaded = true;
    }
    this.cdr.markForCheck();
  }

  isFieldRequired(controlName){
    if(this.causerieForm && this.causerieForm.controls[controlName]){
      const control = this.causerieForm.controls[controlName]
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
		const control = this.causerieForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  
  deleteDoc(item){
    Swal.fire({
      icon: 'warning',
      title: this.translate.instant("REMONTEES.NOTIF.DOC_DELETE_CONFIRMATION.TITLE"),
      html: '<p>'+this.translate.instant("REMONTEES.NOTIF.DOC_DELETE_CONFIRMATION.LABEL")+'</p>',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: this.translate.instant("ACTION.CANCEL"),
      confirmButtonText: this.translate.instant("ACTION.CONFIRM"),
    }).then(async response => {
      if (response.value) {
        this.documentService.delete(item.id).toPromise()
        .then((res) => {
          this.cdr.markForCheck();
          var docArray = this.causerieForm.get('documents') as FormArray;
          docArray.removeAt(docArray.value.findIndex(x => x.id === item.id))
          Swal.fire({
            icon: 'success',
            title: this.translate.instant("REMONTEES.NOTIF.DOC_DELETED.TITLE"),
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
  
  onFileDrop(event){
    var extensions = ['jpg','bmp','jpeg','gif','png','tif','heic', 'pdf'];

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

  submitForm(bool){
    if(bool){
      this.onSubmit.emit(bool)
    }
  }
  cancelForm(){
    this.onCancel.emit()
  }

  uploadSubmit() {
    
  }

}
