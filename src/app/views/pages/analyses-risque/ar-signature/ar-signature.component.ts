import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { ArDetailComponent } from '../ar-detail/ar-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ArService, ChantierService } from '@app/core/services';

@Component({
  selector: 'tf-ar-signature',
  templateUrl: './ar-signature.component.html',
  styleUrls: ['./ar-signature.component.scss']
})
export class ArSignatureComponent extends ArDetailComponent implements OnInit {

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
