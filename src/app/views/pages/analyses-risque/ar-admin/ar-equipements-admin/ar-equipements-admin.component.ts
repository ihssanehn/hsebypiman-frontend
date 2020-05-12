import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EquipementService } from '@app/core/services';
import { ArBaseAdminComponent } from '../ar-base-admin/ar-base-admin.component';

@Component({
  selector: 'ar-equipements-admin',
  templateUrl: './ar-equipements-admin.component.html'
})
export class ArEquipementsAdminComponent extends ArBaseAdminComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  protected tpl : any = {
    title : 'Équipements',
    collapsed : false,
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
      var res = await this.parentService.getAll().toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem("Ajouter un équipement");  
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Equipement archivé avec succès" });
  }

}
