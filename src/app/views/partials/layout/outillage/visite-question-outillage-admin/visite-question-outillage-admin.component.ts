import { Component, OnInit, Injector, ChangeDetectorRef, Input } from '@angular/core';
import { AdminTemplateComponent } from '../../admin-template/admin-template.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatQuestionService, QuestionService } from '@app/core/services';

@Component({
  selector: 'tf-visite-question-outillage-admin',
  templateUrl: '../../admin-template/admin-template.component.html',
  styleUrls: ['../../admin-template/admin-template.component.scss']
})
export class VisiteQuestionOutillageAdminComponent extends AdminTemplateComponent implements OnInit {
  cdr: ChangeDetectorRef;
  modalService: NgbModal;
  parentService: any;
  childService: any;
  _type: any;
  tpl = {
    title: 'Questions ',
    deletedMessage: 'Suppression impossible car la selection comprend un élément affecté à un ou plusieurs chantiers',
    deletedChildMessage: 'Suppression impossible car la selection est affectée à un ou plusieurs chantiers',
    collapsed: true,
    childCol: 6
  }
  @Input() set type(value: any) {
    this._type = value;
    if (value && value.libelle)
      this.tpl.title = "Question " + value.libelle;
  }

  constructor(injector: Injector) {
    super(injector);
    this.cdr = injector.get(ChangeDetectorRef);
    this.modalService = injector.get(NgbModal);
    this.parentService = injector.get(CatQuestionService);
    this.childService = injector.get(QuestionService);
  }

  formatChildren(item) {
    item['children'] = item['questions']
    return item;
  }

  async addItem() {
    super.addItem("Ajouter une catégorie de question");
  }


  async getList(item) {
    let payload = { ...item, type_id: this._type.id };
    super.getList(payload);
  }


  async deleteItem({ id }) {
    super.deleteItem({ id }, { title: "Question archivée avec succès" });
  }


  async addChild(item) {
    let payload = { ...item, cat_question_id: item.cat_question_id };
    super.addChild(payload);
  }

  async deleteChild({ id, parent_id }) {
    super.deleteChild({ id, parent_id }, { title: "Element est archivé avec succès" });
  }

}
