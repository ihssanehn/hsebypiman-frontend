import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { ZoneService, TypeService } from '@app/core/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';

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
    collapsed : false,
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
    let res = await this.parentService.getAllFromModel('Zone').toPromise();
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
    super.addItem("Ajouter une zone", {model : 'Zone'});  
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
