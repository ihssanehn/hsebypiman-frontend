import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatHabilitationService, HabilitationService, TypeService } from '@app/core/services';

@Component({
  selector: 'action-origines-admin',
  styleUrls: ['./action-origines-admin.component.scss'],
  templateUrl: './action-origines-admin.component.html'
})
export class ActionOriginesAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Origines',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs actions',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs actions',
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
      var res = await this.parentService.getAllAsAdmin({'model': 'Action'}).toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem("Ajouter une origine", {model: 'Action'});  
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Origine archivée avec succès" });
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
