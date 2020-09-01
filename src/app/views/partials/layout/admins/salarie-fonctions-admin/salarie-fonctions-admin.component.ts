import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
  selector: 'salarie-fonctions-admin',
  styleUrls: ['./salarie-fonctions-admin.component.scss'],
  templateUrl: './salarie-fonctions-admin.component.html'
})
export class SalarieFonctionsAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Fonctions des salariés',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs salariés',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs salariés',
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
      var res = await this.parentService.getAllFromModel('User').toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem("Ajouter une fonction", {ordre: this.generateParentOrdre()});  
  }


  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'User' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Fonction archivée avec succès" });
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
