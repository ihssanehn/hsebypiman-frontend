import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatHabilitationService, HabilitationService } from '@app/core/services';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'habilitations-admin',
  templateUrl: '../../../../partials/layout/admin-template/admin-template.component.html',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss']
})
export class HabilitationsAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any;

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatHabilitationService);
    this.childService = injector.get(HabilitationService);
    this.translate = injector.get(TranslateService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.refreshTranslations();
    this.tpl = {
      title : this.translate.instant("CHANTIERS.CARD.HABILITATION.SHORTTITLE"),
      deletedMessage: this.translate.instant("CHANTIERS.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
      deletedChildMessage: this.translate.instant("CHANTIERS.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE"),
      collapsed : true,
      canUpdateTitle: false,
      titleOject: null,
      childCol : 6
    }
  }

  refreshTranslations(){
		this.translate.stream("CHANTIERS.CARD.HABILITATION.SHORTTITLE").subscribe(x =>{
			 this.tpl.title = x;
		});
		this.translate.stream("CHANTIERS.NOTIF.ELEMENT_NOT_DELETED.TITLE").subscribe(x =>{
			this.tpl.deletedMessage = x;
	   });
		this.translate.stream("CHANTIERS.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE").subscribe(x =>{
			this.tpl.deletedChildMessage = x;
		});
	}

  formatChildren(item){
    item['children'] = item['habilitations']
    return item;
  }

  async addItem(){
    super.addItem(this.translate.instant("CHANTIERS.ACTION.ADD_HABILITATION"), {ordre: this.generateParentOrdre()});  
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("CHANTIERS.NOTIF.HABILITATION_ARCHIVED.TITLE") });
  }

  async addChild(item){
    let payload = { ...item, cat_hab_id : item.parent_id };
    super.addChild(payload);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : this.translate.instant("CHANTIERS.NOTIF.ELEMENT_ARCHIVED.TITLE") });
  }

}
