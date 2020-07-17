import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService, CategorieService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
  selector: 'materiel-types-admin',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss'],
  templateUrl: '../../../../partials/layout/admin-template/admin-template.component.html'
})
export class MaterielTypesAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Types d\'materiel',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à une ou plusieurs materiels',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à une ou plusieurs materiels',
    collapsed : false,
    childCol : 12
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CategorieService);
    this.childService = injector.get(CategorieService);
  }


  async getList(){
    try {
      var res = await this.parentService.getAllAsAdmin({model:'Materiel',structure:true}).toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  formatChildren(item){
    item['children'] = item['children']; 
    return item;
  }


  async addItem(){
    super.addItem("Ajouter un type de materiel", {model : 'Materiel'});  
  }


  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Materiel' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Type d'materiel archivé avec succès" });
  }

}
