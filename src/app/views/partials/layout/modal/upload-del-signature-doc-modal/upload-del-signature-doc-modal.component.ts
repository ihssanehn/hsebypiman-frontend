import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@app/core/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'tf-upload-del-signature-doc-modal',
  templateUrl: './upload-del-signature-doc-modal.component.html',
  styleUrls: ['./upload-del-signature-doc-modal.component.scss']
})
export class UploadDelSignatureDocModalComponent implements OnInit {

  userId: number;
  form: FormGroup;
	formloading: boolean = false;
  uploader: FileUploader = new FileUploader({
    isHTML5: true
  });

  constructor(
    public activeModal: NgbActiveModal,
		private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translate:TranslateService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formloading = true;
		this.form = this.fb.group({
      documentToUpload: [null, null]
    });
		this.formloading = false;
  }

  async save(){
    this.formloading = true
    let formData = new FormData();
 
    let fileItem = this.uploader.queue[0]._file;
    formData.append('document', fileItem);
    
    var res = await this.userService.saveDelegationSignatureDoc(this.userId, formData).toPromise();
    if(res) {
      this.activeModal.close(res);
    }
    
  }

  seeItem(item){
    return item.file.name
  }

  onFileDrop(event) {
    var extensions = ['pdf'];

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
