import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
  selector: 'remontee-types-admin',
  styleUrls: ['./remontee-types-admin.component.scss'],
  templateUrl: './remontee-types-admin.component.html'
})
export class RemonteeTypesAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Typologies de remontée',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à une ou plusieurs remontées',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à une ou plusieurs remontées',
    collapsed : false,
    canUpdateTitle: false,
    titleOject: null,
    childCol : 12
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(TypeService);
  }


  async getList(){
    try {
      var res = await this.parentService.getAllFromModel('Remontee').toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem("Ajouter une typologie de remontée", {ordre: this.generateParentOrdre()});  
  }


  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Remontée' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Typologie de remontée archivée avec succès" });
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
