import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusService } from '@app/core/services';
import { Status } from '@app/core/models';

@Component({
  selector: 'tf-update-status-modal',
  templateUrl: './update-status-modal.component.html',
  styleUrls: ['./update-status-modal.component.scss']
})
export class UpdateStatusModalComponent implements OnInit {

  statusList: Status[] = [];
  status_id;

  constructor(
    public statusService: StatusService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getStatus();
  }

  async getStatus(){
    await this.statusService.getAllFromModel('Demande').toPromise().then(res=>{
      this.statusList = res.result.data;
      this.cdr.markForCheck();
    })
  }

  updateStatus(){
    this.activeModal.close(this.status_id);
  }
  
}
