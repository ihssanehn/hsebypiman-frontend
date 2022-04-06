import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Type } from '@app/core/models';
import { TypeService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tf-admin-suivi-hse',
  templateUrl: './admin-suivi-hse.component.html',
  styleUrls: ['./admin-suivi-hse.component.scss']
})
export class AdminSuiviHseComponent implements OnInit {

  types: Type[];

  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  async getTypes(){
    var res = await this.typeService.getAllFromModel('CatMetric').toPromise();
    this.types = res.result.data
    this.cdr.markForCheck();
  }

  getTpl(type){
    return {
        title : type.libelle,
        deletedMessage: this.translate.instant("SUIVI_HSE.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
        deletedChildMessage: this.translate.instant("SUIVI_HSE.NOTIF.ELEMENT_NOT_DELETED.LABEL"),
        collapsed : false,
        childCol : 6
      }
  }
}

