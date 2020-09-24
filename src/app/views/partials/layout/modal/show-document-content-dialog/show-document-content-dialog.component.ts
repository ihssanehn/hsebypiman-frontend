import { Component, OnInit, Inject } from '@angular/core';
import { DocumentService } from '@app/core/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'tf-show-document-content-dialog',
  templateUrl: './show-document-content-dialog.component.html',
  styleUrls: ['./show-document-content-dialog.component.scss']
})
export class ShowDocumentContentDialogComponent implements OnInit{

  slideIndex = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ShowDocumentContentDialogComponent>,
    private documentService : DocumentService,
  ) {}

  ngOnInit() {
    this.data.document.image = this.documentService.readFile(this.data.document.id);
  }

  ngAfterViewInit() {
  }

  closeModal(){
    document.getElementById('imgModal').style.display = "none";
    this.dialogRef.close();
  }

}
