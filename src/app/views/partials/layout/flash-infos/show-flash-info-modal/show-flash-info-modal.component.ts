import { Component, OnInit, Inject } from '@angular/core';
import { FlashInfoService } from '@app/core/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SafePipe } from '@app/core/_base/layout/pipes/safe.pipe';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FlashInfo } from '@app/core/models';

@Component({
  selector: 'tf-show-flash-info-modal',
  templateUrl: './show-flash-info-modal.component.html',
  styleUrls: ['./show-flash-info-modal.component.scss']
})
export class ShowFlashInfoModalComponent implements OnInit{

  flashInfoId:number;
  flashInfo: FlashInfo;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<ShowFlashInfoContentDialogComponent>,
    public activeModal: NgbActiveModal,
    private flashInfoService: FlashInfoService,
  ) {}

  ngOnInit() {
    this.getFlashInfo();
  }

  async getFlashInfo(){
    await this.flashInfoService.get(this.flashInfoId).toPromise().then(res=>{
      this.flashInfo = res.result.data;
    })
  }


  closeModal(){
    this.activeModal.close();
  }

}
