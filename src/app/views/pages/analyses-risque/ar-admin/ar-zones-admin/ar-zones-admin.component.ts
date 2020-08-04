import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { ZoneService, TypeService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ar-zones-admin',
  templateUrl: '../../../../partials/layout/admin-template/admin-template.component.html',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss']
})
export class ArZonesAdminComponent extends AdminTemplateComponent  implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;

  tpl : any = {
    title : 'Zones',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à une ou plusieurs analyses de risque',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à une ou plusieurs analyses de risque',
    collapsed : true,
    childCol : 6
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(TypeService);
    this.childService = injector.get(ZoneService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  async getList(){
    let res = await this.parentService.getAllAsAdmin({model:'Zone'}).toPromise();
    this.list = res.result.data.map( (type:any) => { this.initChildren(type); return type })
    for (let item of this.list) {
      item['children'] = await this.getZones(item.id);
    }
    this.cdr.markForCheck();
  }

  async getZones(type_id = null){
    try {
      return await this.childService.getByType(type_id).toPromise();
		} catch (error) {
			console.error(error);
		}
  }

  async getItem({id}){
    try {
      var item = await this.parentService.get(id).toPromise();
      const index = this.list.findIndex(item => item.id === id);
      this.list[index]['children'] = await this.getZones(item.id);
      this.cdr.markForCheck();
    } catch (error) {
      console.error(error);
    }
  }

  // implemented
  async addItem(){
    super.addItem("Ajouter une zone", {model : 'Zone', ordre: this.generateParentOrdre()});  
  }

  // implemented
  async saveItem(item){
    super.saveItem(item);
  }

  // implemented
  async deleteItem({id}){
    super.deleteItem({id}, { title : "Zone archivée avec succès" });
  }

  // implemented
  async addChild(item){
    let payload = { ...item, type_id : item.parent_id};
    super.addChild(payload);
  }

  // implemented
  async updateChild(item){
    super.updateChild(item);
  }

  // implemented
  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : "Element est archivé avec succès" });
  }



}
