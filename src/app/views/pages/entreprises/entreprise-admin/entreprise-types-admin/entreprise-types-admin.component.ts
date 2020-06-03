import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TypeService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
  selector: 'entreprise-types-admin',
  styleUrls: ['./entreprise-types-admin.component.scss'],
  templateUrl: './entreprise-types-admin.component.html'
})
export class EntrepriseTypesAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Types d\'entreprise',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à une ou plusieurs entreprises',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à une ou plusieurs entreprises',
    collapsed : false,
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
      var res = await this.parentService.getAllFromModel('Entreprise').toPromise();
      this.list = res.result.data;
      this.cdr.markForCheck();
		} catch (error) {
			console.error(error);
		}
  }

  async addItem(){
    super.addItem("Ajouter un type d'entreprise");  
  }


  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Entreprise' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Type d'entreprise archivé avec succès" });
  }

}
