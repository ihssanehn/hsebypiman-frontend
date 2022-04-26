import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import moment from 'moment';
import { GuestService } from '@app/core/auth/_services/guest.service';

@Component({
  selector: 'tf-pdp-validation',
  templateUrl: './pdp-validation.component.html',
  styleUrls: ['./pdp-validation.component.scss']
})
export class PdpValidationComponent implements OnInit {

  token;
  itemId;
  itemType;
  fromGuest;

  constructor(
    private route: ActivatedRoute,
    private guestService: GuestService,
    private cdr: ChangeDetectorRef,
  ){
    this.route.params.subscribe(params=>{
      this.itemId = parseInt(params['itemid']);
      this.token = params['token'];      
    })
    this.itemType = 'PdpValidation';
  }
  ngOnInit(){
    if(!this.itemId || !this.token || !this.itemType){
      console.log('issueHere');
    }else{
      this.loadPdp();
    }
  }

  async loadPdp(){
    await this.guestService.find({
      item_id:this.itemId,
      token:this.token,
      item_type:this.itemType
    }).toPromise().then(res=>{
      this.fromGuest = {
        itemId:this.itemId,
        token:this.token,
        itemType:this.itemType,
        pdp: res.result.data
      }
			this.cdr.markForCheck();
    }).catch(error=>{
        console.log(error);
    })
  }
}

