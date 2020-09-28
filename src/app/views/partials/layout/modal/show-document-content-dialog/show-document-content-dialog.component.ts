import { Component, OnInit, Inject } from '@angular/core';
import { DocumentService } from '@app/core/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SafePipe } from '@app/core/_base/layout/pipes/safe.pipe';

@Component({
  selector: 'tf-show-document-content-dialog',
  templateUrl: './show-document-content-dialog.component.html',
  styleUrls: ['./show-document-content-dialog.component.scss']
})
export class ShowDocumentContentDialogComponent implements OnInit{

  slideIndex = 0;

  image_extensions = [
    'jpg','bmp','jpeg','gif','png','tif',
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShowDocumentContentDialogComponent>,
    private documentService : DocumentService,
    private safe: SafePipe,
  ) {}

  ngOnInit() {
    if(this.image_extensions.indexOf(this.data.document.extension.toLowerCase()) != -1){
      this.data.document.image = this.safe.transform(this.documentService.readFile(this.data.document.id), 'resourceUrl');
      console.log('image')
    }else if(this.data.document.extension.toLowerCase() == 'pdf'){
      this.data.document.pdf = this.safe.transform(this.documentService.readFile(this.data.document.id), 'resourceUrl');
      console.log('pdf')
    }
    else if(['doc', 'docx', 'xls', 'xlsx'].indexOf(this.data.document.extension.toLowerCase()) != -1 ){
      this.data.document.doc = this.documentService.readFile(this.data.document.id);
    }

  }

  ngAfterViewInit() {
  }

  closeModal(){
    document.getElementById('imgModal').style.display = "none";
    this.dialogRef.close();
  }

}
