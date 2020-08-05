import { Component, OnInit, ChangeDetectorRef, Input, Injector } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatMetricService, MetricService } from '@app/core/services';

@Component({
  selector: 'salarie-metrics-admin',
  templateUrl: 'salarie-metrics-admin.component.html',
  styleUrls: ['../../../../partials/layout/admin-template/admin-template.component.scss']
})
export class SalarieMetricsAdminComponent extends AdminTemplateComponent implements OnInit {

  @Input() set type(value: any) {
    this._type = value;
    if(value && value.libelle)
      this.tpl.title = value.libelle;
  }

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  _type: any;
  list: any[];
  tpl = {
    title : 'Questions ',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs éléments',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs éléments',
    collapsed : true,
    canUpdateTitle: false,
    titleOject: null,
    childCol : 6
  }

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatMetricService);
    this.childService = injector.get(MetricService);
  }

  formatChildren(item){
    item['children'] = item['metrics']
    return item;
  }

  async addItem(){
    super.addItem("Ajouter une catégorie", {type_id : this._type.id, ordre: this.generateParentOrdre()});  
  }

  async getList(item){
    let payload = { ...item, type_id : this._type.id };
    super.getList(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Élément archivé avec succès" });
  }

  async addChild(item){
    let payload = { ...item, cat_question_id : item.cat_question_id };
    super.addChild(payload);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : "Élément est archivé avec succès" });
  }
}
