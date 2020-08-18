import { Component, OnInit, ChangeDetectorRef, Injector, Input } from '@angular/core';
import { AdminTemplateComponent } from '@app/views/partials/layout/admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatQuestionService, QuestionService, TypeService } from '@app/core/services';
import { Type } from '@app/core/models';

@Component({
  selector: 'visite-questions-outillage-admin',
  templateUrl: '../../admin-template/admin-template.component.html',
  styleUrls: ['../../admin-template/admin-template.component.scss']
})
export class VisiteQuestionsOutillageAdminComponent extends AdminTemplateComponent implements OnInit {

  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  _type: any;
  tpl = {
    title : 'Formulaires ',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs outils',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs outils',
    collapsed : true,
    canUpdateTitle: true,
    titleObject: null,
    childCol : 6
  }
  @Input() set type(value: any) {
    this._type = value;
    if(value && value.libelle)
      this.tpl.title = value.libelle;
      this.tpl.titleObject = value;
  }

  list: any[];

  constructor(injector: Injector) {
    super(injector);        
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatQuestionService);
    this.childService = injector.get(QuestionService);
    this.titleService = injector.get(TypeService);
  }

  formatChildren(item){
    item['children'] = item['questions']
    return item;
  }

  async addItem(){
    super.addItem("Ajouter une catégorie de questions", {type_id : this._type.id, ordre: this.generateParentOrdre()});  
  }

  async getList(item){
    let payload = { ...item, type_id : this._type.id };
    super.getList(payload);
  }

  async deleteItem({id}){
    super.deleteItem({id}, { title : "Catégorie archivée avec succès" });
  }

  async addChild(item){
    let payload = { ...item, 
                    cat_question_id : item.cat_question_id,
                    ordre : this.generateOrdre(item.parent_id)
                  };
    super.addChild(payload);
  }

  async deleteChild({id, parent_id}){
    super.deleteChild({id, parent_id}, {title : "La question est archivée avec succès" });
  }
}
