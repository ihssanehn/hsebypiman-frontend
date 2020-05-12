import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatHabilitationService, HabilitationService } from '@app/core/services';

@Component({
  selector: 'chantier-habilitations-admin',
  templateUrl: '../../../../partials/layout/admin-template/admin-template.component.html',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss']
})
export class ChantierHabilitationsAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  protected tpl : any = {
    title : 'Habilitations',
    collapsed : false,
    childCol : 6
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatHabilitationService);
    this.childService = injector.get(HabilitationService);
  }

  formatChildren(item){
    item['children'] = item['habilitations']
    return item;
  }

  async addItem(){
    super.addItem("Ajouter une habilitation");  
  }


  async deleteItem({id}){
    super.deleteItem({id}, { title : "Habilitation archivée avec succès" });
  }


  async addChild(item){
    let payload = { ...item, cat_hab_id : item.parent_id };
    super.addChild(payload);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : "Element est archivé avec succès" });
  }

}
