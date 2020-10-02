import { Component, OnInit, Injector, ChangeDetectorRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService, ZoneService, CatRisqueService, RisqueService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { TranslateService } from '@ngx-translate/core';

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
  translate: TranslateService;

  tpl : any; 

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatRisqueService);
    this.childService = injector.get(RisqueService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.tpl = {
      title : this.translate.instant("ARS.CARD.RISKS.SHORTTITLE"),
      deletedMessage: this.translate.instant("ARS.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
      deletedChildMessage: this.translate.instant("ARS.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE"),
      collapsed : true,
      canUpdateTitle: false,
      titleOject: null,
      childCol : 6
    }
  }

  formatChildren(item){
    item['children'] = item['risques']; 
    return item;
  }

  async addItem(){
    super.addItem(this.translate.instant("ARS.ACTION.ADD_RISK"), {ordre: this.generateParentOrdre()});  
  }

  async createItem(payload){
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle) }
    super.createItem(payload);
  }
  
  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("ARS.NOTIF.RISK_ARCHIVED.TITLE") });
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
    super.deleteChild({id, parent_id}, {title : this.translate.instant("ARS.NOTIF.ELEMENT_ARCHIVED.TITLE") });
  }

}
