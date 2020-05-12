import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService, ZoneService, CatRisqueService, RisqueService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
  selector: 'ar-risques-admin',
  templateUrl: '../../../../partials/layout/admin-template/admin-template.component.html',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss']
})
export class ArRisquesAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Risques',
    collapsed : true,
    childCol : 6
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatRisqueService);
    this.childService = injector.get(RisqueService);
  }

  formatChildren(item){
    item['children'] = item['risques']; 
    return item;
  }

  async addItem(){
    super.addItem("Ajouter un risque");  
  }

  async createItem(payload){
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle) }
    super.createItem(payload);
  }
  
  async deleteItem({id}){
    super.deleteItem({id}, { title : "Risque archivé avec succès" });
  }

  async addChild(item){
    let payload = { ...item, 
                    cat_risque_id : item.parent_id, 
                    code : this.generateCode(item.libelle),
                    ordre : this.generateOrdre(item.parent_id)
                  };
    super.addChild(payload);
  }
  
  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : "Element est archivé avec succès" });
  }

}
