import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ModuleService, FlashInfoService } from '@app/core/services';
import { FlashInfo } from '@app/core/models/';
import { ShowFlashInfoModalComponent } from '@app/views/partials/layout/flash-infos/show-flash-info-modal/show-flash-info-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tf-flash-infos-top',
  templateUrl: './flash-infos-top.component.html',
  styleUrls: ['./flash-infos-top.component.scss']
})
export class FlashInfosTopComponent implements OnInit {

	flashOnTop : FlashInfo
	oldFlashList : FlashInfo[];
	
  constructor(
		private flashInfoService: FlashInfoService,
		private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
		this.getFlashInfos();
  }

	async getFlashInfos(){
		var res = await this.flashInfoService.getAll({top:true, limit:5}).toPromise()
		
		this.flashOnTop = res.result.data['top'];
		if(this.flashOnTop){
			// this.openFlashInfoModal(this.flashOnTop.id)
		}
		this.oldFlashList = res.result.data['others'];
		this.cdr.markForCheck();
	}

	openFlashInfoModal(flash_id){
		const modalRef = this.modalService.open(ShowFlashInfoModalComponent, {size: 'xl',scrollable: true, centered : true});
		modalRef.componentInstance.flashInfoId = flash_id;
	}

}
