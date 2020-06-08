import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { CatHabilitationService, HabilitationService, TypeService } from '@app/core/services';
import { Type } from '@app/core/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'tf-visite-chantier-admin',
  templateUrl: './visite-chantier-admin.component.html',
  styleUrls: ['./visite-chantier-admin.component.scss']
})
export class VisiteChantierAdminComponent implements OnInit {

  types: Type[];
  constructor(
    private typeService: TypeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getTypes();

  }

  async getTypes(){
      var res = await this.typeService.getAllFromModel('VsChantier').toPromise();
      this.types = res.result.data
      this.cdr.detectChanges();
      this.cdr.markForCheck();
  }
  getTpl(type){
    return {
        title : 'Questions '+type.libelle,
        deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs chantiers',
        deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs chantiers',
        collapsed : false,
        childCol : 6
      }
  }
}
