import { Component, OnInit, ChangeDetectorRef, Injector, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategorieService } from '@app/core/services';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

@Component({
  selector: 'materiel-types-admin',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss'],
  templateUrl: './materiel-types-admin.component.html'
})
export class MaterielTypesAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Types de matériel',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à une ou plusieurs matériels',
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

  ngOnInit() {
    super.ngOnInit();
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

  async getItem({id}){
    try {
      var item = await this.parentService.get(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list[index]['children'] = item.children;
      console.log(this.list);
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  async addItem(){
    super.addItem("Ajouter un type de matériel", {model : 'Materiel'});  
  }

  async createItem(payload){
    payload = {...payload, ordre : this.generateParentOrdre(), model: 'Materiel' }
    if( payload.libelle )
      payload = { ...payload, code : this.generateCode(payload.libelle)}

    super.createItem(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Type de matériel archivé avec succès" });
  }

  async addChild(item){
    let payload = { ...item, 
      model : 'Materiel',
      code : this.generateCode(item.libelle),
      ordre : this.generateOrdre(item.parent_id)
    };
    super.addChild(payload);
  }

  async updateChild(item){
    super.updateChild(item);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : "Element est archivé avec succès" });
  }
}
