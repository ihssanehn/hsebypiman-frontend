import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Type } from '@app/core/models';
import { TypeService } from '@app/core/services';

@Component({
  selector: 'tf-visite-vehicule-admin',
  templateUrl: './visite-vehicule-admin.component.html',
  styleUrls: ['./visite-vehicule-admin.component.scss']
})
export class VisiteVehiculeAdminComponent implements OnInit {

  types: Type[];

  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  async getTypes(){
      var res = await this.typeService.getAllFromModel('VsVehicule').toPromise();
      this.types = res.result.data
      this.cdr.detectChanges();
      this.cdr.markForCheck();
  }

  getTpl(type){
    return {
        title : 'Questions '+type.libelle,
        deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs véhicules',
        deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs véhicules',
        collapsed : false,
        childCol : 6
      }
  }

}
