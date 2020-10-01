import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipementService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ar-equipements-admin',
  styleUrls: ['./ar-equipements-admin.component.scss'],
  templateUrl: './ar-equipements-admin.component.html'
})
export class ArEquipementsAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  translate: TranslateService;

  tpl : any = {
    title : this.translate.instant("ARS.CARD.EQUIPEMENT.SHORTTITLE"),
    deletedMessage: this.translate.instant("ARS.NOTIF.ELEMENT_NOT_DELETED.TITLE"),
    deletedChildMessage: this.translate.instant("ARS.NOTIF.ELEMENT_NOT_DELETED.SUBTITLE"),
    collapsed : true,
    canUpdateTitle: false,
    titleOject: null,
    childCol : 12
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(EquipementService);
    this.translate = injector.get(TranslateService);
  }


  async getList(){
    try {
      var res = await this.parentService.getAllAsAdmin().toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem(this.translate.instant("ARS.ACTION.ADD_EQUIPEMENT"), {ordre: this.generateParentOrdre()});  
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : this.translate.instant("ARS.NOTIF.EQUIPEMENT_ARCHIVED.TITLE") });
  }

  async updateOrders(datas){
    try {
      await this.parentService.updateOrders(datas).toPromise();
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }
}
