import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
        }).catch(err=>{
          console.log(err)
        })
      default: 
        return this.activeModal.close(event);
    }
  }

  closeMailModal(){
    return this.activeModal.dismiss();
  }
  
}
