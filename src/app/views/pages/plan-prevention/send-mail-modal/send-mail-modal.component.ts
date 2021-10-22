import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PeriodService } from '@app/core/services';
import Swal from 'sweetalert2';
import { DateFrToEnPipe, DateEnToFrPipe } from '@app/core/_base/layout';
import { FollowUpPeriod } from '@app/core/models';
import { MatInput, MatDatepickerInput, DateAdapter } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { GuestService } from '@app/core/auth/_services/guest.service';


@Component({
  selector: 'tf-send-mail-modal',
  templateUrl: './send-mail-modal.component.html',
  styleUrls: ['./send-mail-modal.component.scss']
})
export class SendMailModalComponent implements OnInit {

  element
  el_type
  action


  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private guestService: GuestService,
  ) { 
    
  }

  ngOnInit() {
  }

  sendMail(event){
    console.log(event);
    switch(this.action){
      case 'sendGuestAccess':
        var datas = {
          'emails': event,
          'item_id': this.element.id,
          'item_type': this.el_type,
        }
        this.guestService.sendGuestAccess(datas).toPromise().then(res=>{
          return this.activeModal.close(event);          
        })
      default: 
        return this.activeModal.close(event);
    }
  }

  closeMailModal(){
    return this.activeModal.dismiss();
  }
  
}
