import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipementService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

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

  tpl : any = {
    title : 'Équipements',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à une ou plusieurs analyses de risque',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à une ou plusieurs analyses de risque',
    collapsed : true,
    childCol : 12
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(EquipementService);
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
    super.addItem("Ajouter un équipement", {ordre: this.generateParentOrdre()});  
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Equipement archivé avec succès" });
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
