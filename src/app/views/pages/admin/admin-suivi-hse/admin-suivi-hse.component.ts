import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Type } from '@app/core/models';
import { TypeService } from '@app/core/services';

@Component({
  selector: 'tf-admin-suivi-hse',
  templateUrl: './admin-suivi-hse.component.html',
  styleUrls: ['./admin-suivi-hse.component.scss']
})
export class AdminSuiviHseComponent implements OnInit {

  types: Type[];

  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef
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
        deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs éléments',
        deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs éléments',
        collapsed : false,
        childCol : 6
      }
  }
}

