import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminAddModalComponent } from '@app/views/partials/layout/admin-add-modal/admin-add-modal.component';
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
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.getTypes();
  }

  async getTypes(){
      var res = await this.typeService.getAllFromModel('VsVehicule').toPromise();
      this.types = res.result.data
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

  async createFormulaire(payload, appends){
    if(payload){
      var ordre = this.types.length + 1;
      var _payload = {
        model:'VsChantier',
        ordre: ordre,
        code: 'OTHER',
        ...payload
      }
      try {
        var created = await this.typeService.create({ ..._payload, ...appends }).toPromise();
        this.types.push(created);
        this.cdr.markForCheck();
      } catch (error) {
        console.error(error);
      }
    }
  }

  addFormulaire(appends?){
    var title="Nouveau formulaire"
    const modalRef = this.modalService.open(AdminAddModalComponent, {centered : true});
    modalRef.componentInstance.title = ( title || '...' );
    modalRef.result.then( payload => this.createFormulaire(payload, appends), payload => this.createFormulaire(payload, appends) );
  }
}
