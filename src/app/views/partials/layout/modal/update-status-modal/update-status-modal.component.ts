import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusService } from '@app/core/services';
import { Status } from '@app/core/models';
import { AuthService } from '@app/core/auth';

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
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getStatus();
  }

  async getStatus(){
    await this.statusService.getAllFromModel('Demande').toPromise().then(res=>{
      if(this.authService.currentUserValue.role.code == 'MANAGER'){
        this.statusList = res.result.data.filter(x=>['VALIDEE', 'REFUSEE', 'ENVOYEE'].includes(x.code));
      }else{
        this.statusList = res.result.data;
      }
      this.cdr.markForCheck();
    })
  }

  updateStatus(){
    this.activeModal.close(this.status_id);
  }
  
}
