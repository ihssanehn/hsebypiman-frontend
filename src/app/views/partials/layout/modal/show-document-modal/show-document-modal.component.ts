import { Component, OnInit, Inject } from '@angular/core';
import { DocumentService } from '@app/core/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SafePipe } from '@app/core/_base/layout/pipes/safe.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-show-document-modal',
  templateUrl: './show-document-modal.component.html',
  styleUrls: ['./show-document-modal.component.scss']
})
export class ShowDocumentModalComponent implements OnInit{

  slideIndex = 0;
  document:any;
  image_extensions = [
    'jpg','bmp','jpeg','gif','png','tif','heic',
  ]

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<ShowDocumentContentDialogComponent>,
    private documentService : DocumentService,
    public activeModal: NgbActiveModal,
    private safe: SafePipe,
  ) {}

  ngOnInit() {
    if(this.image_extensions.indexOf(this.document.extension.toLowerCase()) != -1){
      this.document.image = this.safe.transform(this.documentService.readFile(this.document.id), 'resourceUrl');
    }else if(this.document.extension.toLowerCase() == 'pdf'){
      this.document.pdf = this.safe.transform(this.documentService.readFile(this.document.id), 'resourceUrl');
    }
    else if(['doc', 'docx', 'xls', 'xlsx'].indexOf(this.document.extension.toLowerCase()) != -1 ){
      this.document.doc = this.documentService.readFile(this.document.id);
    }

  }

  ngAfterViewInit() {
  }

  closeModal(){
    // document.getElementById('imgModal').style.display = "none";
    this.activeModal.close();
    // this.dialogRef.close();
  }

}
