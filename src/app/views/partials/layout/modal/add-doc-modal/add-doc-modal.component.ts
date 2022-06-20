import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import {extractErrorMessagesFromErrorResponse} from '@app/core/_base/crud';
import {FormStatus} from '@app/core/_base/crud/models/form-status';
import {FileUploader} from "ng2-file-upload";
import { Document } from '@app/core/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tf-add-doc-modal',
  templateUrl: './add-doc-modal.component.html',
  styleUrls: ['./add-doc-modal.component.scss']
})
export class AddDocModalComponent implements OnInit{

  document: Document;
  documentForm: FormGroup;
  uploader:FileUploader;
	// allRoles: Role[];
	loaded = false;
	editMode: boolean = false;
  // Private properties
  errors;

  constructor(
  
    public activeModal: NgbActiveModal,
		// private router: Router,
		private docFB: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translate:TranslateService,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.document = new Document();
    this.createForm();
  }

  createForm() {
		this.documentForm = this.docFB.group({
      documentsToUpload: [null, null],
    });
		this.loaded = true;
  }

  saveDocuments(){
    this.activeModal.close(this.documentForm);
  }


  closeModal(){
    this.activeModal.close();
  }

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

  /**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.documentForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result = control.hasError(validationType) && (control.dirty || control.touched);
		return result;
  }
  seeItem(item){
    return item.file.name
  }
  
  onFileDrop(event){
    var extensions = ['jpg','bmp','jpeg','gif','png','tif','heic'];

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
