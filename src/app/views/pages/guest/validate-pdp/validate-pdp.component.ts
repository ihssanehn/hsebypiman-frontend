import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Pdp } from '@app/core/models';
import { DocumentService, PdpService } from '@app/core/services';
import { DateEnToFrPipe, DateFrToEnPipe } from '@app/core/_base/layout';
import { SafePipe } from '@app/core/_base/layout';

import moment from 'moment';
import { GuestService } from '@app/core/auth/_services/guest.service';

@Component({
  selector: 'tf-validate-pdp',
  templateUrl: './validate-pdp.component.html',
  styleUrls: ['./validate-pdp.component.scss']
})
export class ValidatePdpComponent implements OnInit {

  token;
  itemId;
  itemType;

  constructor(
    private route: ActivatedRoute,
    private guestService: GuestService,
  ){
    this.route.params.subscribe(params=>{
      this.itemId = params['itemid'];
      this.token = params['token'];      
    })
    this.itemType = 'PreventionPlan';
  }
  ngOnInit(){
    if(!this.itemId || !this.token || !this.itemType){
      console.log('issueHere');
    }else{
      this.loadPdp();
    }
  }

  loadPdp(){
    this.guestService.getPdp({
      item_id:this.itemId,
      token:this.token,
  }).toPromise().then(res=>{
      console.log(res);
  }).catch(error=>{
      console.log(error);
  })
  
  }
}

